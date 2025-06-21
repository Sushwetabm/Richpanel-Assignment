const axios = require('axios');
const FacebookConnection = require('../models/FacebookConnection');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.sendFacebookMessage = async (pageId, recipientId, messageText, accessToken) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v12.0/me/messages?access_token=${accessToken}`,
      {
        recipient: { id: recipientId },
        message: { text: messageText }
      }
    );
    return response.data;
  } catch (err) {
    console.error('Error sending Facebook message:', err.response?.data || err.message);
    throw err;
  }
};

exports.getUserProfile = async (userId, accessToken) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v12.0/${userId}?fields=name,email,profile_pic&access_token=${accessToken}`
    );
    return response.data;
  } catch (err) {
    console.error('Error getting Facebook user profile:', err.response?.data || err.message);
    throw err;
  }
};