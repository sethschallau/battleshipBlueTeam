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

exports.getUsers = async (req, res) => {
  try{
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};
