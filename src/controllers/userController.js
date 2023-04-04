const { User } = require('../models');

exports.createUser = async (req, res) => {
  try {
    const newUser = new User({ username: req.body.username });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};
