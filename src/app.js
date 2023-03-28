const express = require('express');
const mongoose = require('mongoose');
const { User, Game } = require('./models/models.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the local MongoDB instance and the battleship database
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

// Create a new user as a proof of concept
app.get('/create-user', async (req, res) => {
  try {
    const newUser = new User({ username: 'seth' });
    await newUser.save();
    res.send('User created successfully');
  } catch (err) {
    res.status(500).send('Error creating user:', err.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
