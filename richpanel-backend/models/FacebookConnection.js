const mongoose = require('mongoose');

const facebookConnectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A connection must belong to a user']
  },
  pageId: {
    type: String,
    required: [true, 'A connection must have a page ID']
  },
  pageName: {
    type: String,
    required: [true, 'A connection must have a page name']
  },
  accessToken: {
    type: String,
    required: [true, 'A connection must have an access token']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

facebookConnectionSchema.index({ userId: 1, pageId: 1 }, { unique: true });

module.exports = mongoose.model('FacebookConnection', facebookConnectionSchema);