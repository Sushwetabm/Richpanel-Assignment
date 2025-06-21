const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const FacebookConnection = require('../models/FacebookConnection');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios');

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { messageText } = req.body;
  const conversationId = req.params.id;
  
  // Get conversation
  const conversation = await Conversation.findById(conversationId);
  if (!conversation || conversation.userId.toString() !== req.user.id.toString()) {
    return next(new AppError('No conversation found with that ID', 404));
  }
  
  // Save message
  const message = await Message.create({
    conversationId,
    messageText,
    senderType: 'agent'
  });
  
  // Update conversation last message time
  conversation.lastMessageAt = new Date();
  await conversation.save();
  
  // Send message to Facebook
  const fbConnection = await FacebookConnection.findOne({ userId: req.user.id });
  if (fbConnection) {
    await axios.post(
      `https://graph.facebook.com/v12.0/me/messages?access_token=${fbConnection.accessToken}`,
      {
        recipient: { id: conversation.customerId },
        message: { text: messageText }
      }
    );
  }
  
  // Emit socket event
  const io = req.app.get('socketio');
  io.to(conversationId).emit('newMessage', message);
  
  res.status(201).json({
    status: 'success',
    data: {
      message
    }
  });
});