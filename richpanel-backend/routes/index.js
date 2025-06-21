const express = require('express');
const authRoutes = require('./authRoutes');
const conversationRoutes = require('./conversationRoutes');
const facebookRoutes = require('./facebookRoutes');

const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/conversations', conversationRoutes);
router.use('/api/facebook', facebookRoutes);

module.exports = router;