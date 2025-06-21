const express = require('express');
const conversationController = require('../controllers/conversationController');
const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', conversationController.getAllConversations);
router.get('/:id', conversationController.getConversation);
router.get('/:id/messages', conversationController.getConversationMessages);
router.post('/:id/reply', messageController.sendMessage);

module.exports = router;