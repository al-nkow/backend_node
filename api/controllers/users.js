const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// GET USERS LIST
exports.users_get_user = async (req, res) => {
  try {
    const users = await User.find(); // .select('product quantity _id')
    res.status(200).json({ users: users });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

// SIGN UP USER
exports.users_user_signup = async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email: email });
  if (foundUser) return res.status(409).json({ message: 'Email is already in use' });

  try {
    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: email,
      password: hash
    });

    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch(err) {
    return res.status(500).json({ error: err });
  }
};

// SIGN IN USER
exports.users_user_login = async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email: email });
  if (!foundUser) return res.status(401).json({ message: 'Auth failed' });

  const isMatch = await foundUser.isValidPassword(password); // isValidPassword - custom method

  if (!isMatch) return res.status(401).json({ message: 'Auth failed' });

  const token = jwt.sign({
    email: email,
    userId: foundUser._id
  }, process.env.SECRET_OR_KEY, { expiresIn: '1h' });

  return res.status(200).json({
    message: 'Auth successful',
    token: token
  });
};

// DELETE USERS
exports.users_user_delete = async (req, res) => {
  try {
    await User.remove({ _id: req.params.userId });
    return res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};