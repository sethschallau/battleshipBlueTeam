const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/get/:id', chatController.getChats);

router.post('/send', chatController.sendChat);

module.exports = router;