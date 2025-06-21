const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A conversation must belong to a user']
  },
  customerId: {
    type: String,
    required: [true, 'A conversation must have a customer ID']
  },
  customerName: {
    type: String,
    required: [true, 'A conversation must have a customer name']
  },
  customerEmail: {
    type: String,
    validate: {
      validator: function(v) {
        return v === null || /\S+@\S+\.\S+/.test(v);
      },
      message: 'Please provide a valid email or null'
    }
  },
  platform: {
    type: String,
    enum: ['messenger', 'post'],
    required: [true, 'A conversation must have a platform']
  },
  lastMessageAt: {
    type: Date,
    required: [true, 'A conversation must have a last message timestamp']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

conversationSchema.index({ userId: 1, customerId: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);