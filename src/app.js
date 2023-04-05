const express = require('express');
const mongoose = require('mongoose');
const { User, Game } = require('./models/index.js');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
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

//routes  
app.use('/games', gameRoutes);
app.use('/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
