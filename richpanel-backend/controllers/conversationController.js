const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllConversations = catchAsync(async (req, res, next) => {
  const conversations = await Conversation.find({ userId: req.user.id })
    .sort({ lastMessageAt: -1 })
    .limit(20);

  res.status(200).json({
    status: 'success',
    results: conversations.length,
    data: {
      conversations
    }
  });
});

exports.getConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!conversation) {
    return next(new AppError('No conversation found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      conversation
    }
  });
});

exports.getConversationMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find({
    conversationId: req.params.id
  }).sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages
    }
  });
});