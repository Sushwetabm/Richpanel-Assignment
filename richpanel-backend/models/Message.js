const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: [true, 'A message must belong to a conversation']
  },
  messageText: {
    type: String,
    required: [true, 'A message must have text content'],
    trim: true
  },
  senderType: {
    type: String,
    enum: ['customer', 'agent'],
    required: [true, 'A message must have a sender type']
  },
  fbMessageId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

messageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);