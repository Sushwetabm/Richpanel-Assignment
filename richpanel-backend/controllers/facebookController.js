const axios = require('axios');
const FacebookConnection = require('../models/FacebookConnection');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { getFacebookAuthUrl, exchangeCodeForToken, getPageAccessToken } = require('../config/facebook');

exports.getAuthUrl = catchAsync(async (req, res, next) => {
  const authUrl = getFacebookAuthUrl();
  res.status(200).json({
    status: 'success',
    data: {
      authUrl
    }
  });
});

exports.handleCallback = catchAsync(async (req, res, next) => {
  const { code } = req.query;
  const userId = req.user.id;

  // Exchange code for access token
  const userAccessToken = await exchangeCodeForToken(code);

  // Get user pages
  const { data: pagesData } = await axios.get(
    `https://graph.facebook.com/v12.0/me/accounts?access_token=${userAccessToken}`
  );

  const page = pagesData.data[0]; // Get first page for simplicity

  // Get page access token
  const pageAccessToken = await getPageAccessToken(userAccessToken, page.id);

  // Save connection
  await FacebookConnection.create({
    userId,
    pageId: page.id,
    pageName: page.name,
    accessToken: pageAccessToken
  });

  // Subscribe to webhooks
  await axios.post(
    `https://graph.facebook.com/v12.0/${page.id}/subscribed_apps`,
    {
      subscribed_fields: ['messages', 'messaging_postbacks'],
      access_token: pageAccessToken
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      pageName: page.name
    }
  });
});

exports.disconnect = catchAsync(async (req, res, next) => {
  await FacebookConnection.findOneAndDelete({ userId: req.user.id });
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === process.env.FACEBOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

exports.handleWebhook = catchAsync(async (req, res) => {
  const { entry } = req.body;
  
  // Process each entry
  for (const pageEntry of entry) {
    const pageId = pageEntry.id;
    const messagingEvents = pageEntry.messaging;
    
    if (messagingEvents) {
      for (const event of messagingEvents) {
        // Process message event
        if (event.message) {
          await processMessage(event, pageId);
        }
      }
    }
  }
  
  res.status(200).send('EVENT_RECEIVED');
});

async function processMessage(event, pageId) {
  const senderId = event.sender.id;
  const messageText = event.message.text;
  const timestamp = event.timestamp;
  
  // Find the Facebook connection
  const connection = await FacebookConnection.findOne({ pageId });
  if (!connection) return;

  // Find or create conversation
  let conversation = await Conversation.findOne({
    userId: connection.userId,
    customerId: senderId
  });

  if (!conversation) {
    // Get sender info from Facebook
    const { data: senderData } = await axios.get(
      `https://graph.facebook.com/v12.0/${senderId}?fields=name,email&access_token=${connection.accessToken}`
    );

    conversation = await Conversation.create({
      userId: connection.userId,
      customerId: senderId,
      customerName: senderData.name,
      customerEmail: senderData.email || null,
      platform: 'messenger',
      lastMessageAt: new Date(parseInt(timestamp))
    });
  } else {
    // Update last message time
    conversation.lastMessageAt = new Date(parseInt(timestamp));
    await conversation.save();
  }

  // Save message to database
  const message = await Message.create({
    conversationId: conversation._id,
    messageText,
    senderType: 'customer',
    fbMessageId: event.message.mid,
    createdAt: new Date(parseInt(timestamp))
  });

  // Emit real-time update via Socket.io
  const io = req.app.get('socketio');
  io.to(conversation._id.toString()).emit('newMessage', message);
}