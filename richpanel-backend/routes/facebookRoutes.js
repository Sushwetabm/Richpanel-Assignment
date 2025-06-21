const express = require('express');
const facebookController = require('../controllers/facebookController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/auth-url', facebookController.getAuthUrl);
router.get('/callback', facebookController.handleCallback);
router.delete('/disconnect', facebookController.disconnect);

// Webhook routes (no auth needed)
router.get('/webhook', facebookController.verifyWebhook);
router.post('/webhook', facebookController.handleWebhook);

module.exports = router;