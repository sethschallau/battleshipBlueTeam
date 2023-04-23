const express = require('express');
const mongoose = require('mongoose');
const { User, Game, Chat } = require('./models/index.js');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cors = require('cors');
const { sendMissile } = require('./controllers/gameController.js');
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
  socket.on('getGame', async (gameId) => {
    try {
      const game = await Game.findById(gameId)
        .populate('players')
        .populate('currentPlayer')
        .populate('winner');
      socket.emit('gameData', game);
    } catch (error) {
      console.error('Error fetching game data', error);
    }
  });
  
  socket.on('missileSent', async (gameId) => {
    try {
      const game = await Game.findById(gameId)
        .populate('players')
        .populate('currentPlayer')
        .populate('winner');
      io.emit('gameData', game);
    } catch (error) {
      console.error('Error fetching game data', error);
    }
  });

  socket.on('sendMissile', async(data) => {
    const missileResult = await sendMissile(data);
    socket.emit('missileResult', missileResult);
  });

  socket.on('getChats', async (gameId) => {
    const chats = await Chat.findOne({ gameId: gameId });
    if (chats) {
      socket.emit('chatData', chats);
    } else {
      socket.emit('chatData', { chats: [] });
    }
  });
  

  socket.on('newMessage', async (messageData) => {
    const chat = await Chat.findOne({ gameId: messageData.gameId });  
    if (chat) {
      chat.chats.push(messageData);
      await chat.save();
    } else {
      const newChat = new Chat({ gameId: messageData.gameId, chats: [messageData] });
      await newChat.save();
    }
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
