const express = require('express');
const chatController = require('../controllers/chatController');
const { Server } = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const router = express.Router();



router.get('/get/:id', chatController.getChats);

router.post('/send/:id', chatController.sendChat);


module.exports = router;