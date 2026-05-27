const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongodb = require('../data/database');

const router = express.Router();


// REGISTER
router.post('/register', async (req, res) => {
  try {

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      username: req.body.username,
      password: hashedPassword
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('users')
      .insertOne(user);

    res.status(201).json({
      message: 'User created',
      userId: response.insertedId
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  try {

    const user = await mongodb
      .getDb()
      .db()
      .collection('users')
      .findOne({
        username: req.body.username
      });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid username'
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: 'Invalid password'
      });
    }

    const token = jwt.sign(
      {
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    res.status(200).json({
      token
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;