const express = require('express');
const mongoose = require('mongoose');
const { User, Game, Chat } = require('./models/index.js');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
});
const PORT = process.env.PORT || 3000;

//database
mongoose
  .connect('mongodb://localhost/battleship', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected');
  // socket.on('getGame', async (gameId) => {
  //   const game = await Game.findById(gameId);
  //   socket.emit('gameData', game);
  // });

  socket.on('getChats', async (gameId) => {
    const chats = await Chat.findOne({ gameId: gameId });
    if (chats) {
      socket.emit('chatData', chats);
    } else {
      socket.emit('chatData', { chats: [] });
    }
  });
  

  socket.on('newMessage', async (messageData) => {
    // Find the chat associated with the game
    const chat = await Chat.findOne({ gameId: messageData.gameId });
  
    if (chat) {
      // Add the message to the existing chat
      chat.chats.push(messageData);
      await chat.save();
    } else {
      // If there is no chat associated with the game, create a new one
      const newChat = new Chat({ gameId: messageData.gameId, chats: [messageData] });
      await newChat.save();
    }
  
    // Emit the new message to all connected clients
    io.emit('message', messageData);
  });
  

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

//routes
app.use('/games', gameRoutes);
app.use('/users', userRoutes);
app.use('/chats', chatRoutes);

// Start the server
http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
