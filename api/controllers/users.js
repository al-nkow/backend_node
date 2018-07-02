const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.users_get_user = (req, res, next) => {
  User.find()
  // .select('product quantity _id')
    .exec()
    .then(docs => {
      res.status(200).json({
        users: docs
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};






exports.users_user_signup = async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email: email });
  if (foundUser) return res.status(409).json({ message: 'Email is already in use' });

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

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








exports.users_user_login = (req, res, next) => {
  User.find({ email: req.body.email }) // also we can use .findOne()
    .exec()
    .then(userArr => {
      if (userArr.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      bcrypt.compare(req.body.password, userArr[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
        if (result) {
          const token = jwt.sign({ // add token
              email: userArr[0].email,
              userId: userArr[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            });
          return res.status(200).json({
            message: 'Auth successful',
            token: token
          });
        }
        return res.status(401).json({
          message: 'Auth failed'
        });
      });
    })
    .catch(err => {
      console.log('LOGIN ERROR: ', err);
      res.status(500).json({
        error: err
      });
    });
};

exports.users_user_delete = (req, res, next) => {
  User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};