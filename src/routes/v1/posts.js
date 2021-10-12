const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const joi = require('joi');

const router = express.Router();

const mysql = require('mysql2/promise');
const dbConfig = require('../../dbConfig');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log('token', token);
  if (!token) return res.status(401).json({ error: 'unauthorized request' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      return res.status(403).json({ error: 'token expired/invalid' });
    }
    console.log('data in jwt', data);
    req.user = data.email;
    req.userId = data.userId;
    next();
  });
}

// GET /posts - get all posts return posts title, timestamp and user email

// GET /posts - with authorization to get posts of current user
router.get('/', authenticateToken, async (req, res) => {
  const postId = req.userId;
  // res.json('auth posts');
  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = 'SELECT * FROM userPosts WHERE author = ?';
    const [dbResult] = await conn.execute(sql, [postId]);
    await conn.end();
    res.json({ msg: 'success', posts: dbResult });
  } catch (error) {
    console.log('errr', error.message);
    res.status(500).send('somenithng went sideways');
  }
});

module.exports = router;
