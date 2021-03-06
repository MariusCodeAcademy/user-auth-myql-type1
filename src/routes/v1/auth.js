const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const joi = require('joi');

const router = express.Router();

const mysql = require('mysql2/promise');
const dbConfig = require('../../dbConfig');

const { hashValue } = require('../../utils/hashHelper');
const { validateRegister } = require('../../utils/validateHelper');

const posts = [
  {
    id: 1,
    user: 'James@bond.com',
    text: 'some text made by James ',
  },
  {
    id: 2,
    user: 'Jane@gmail.com',
    text: 'some text made by Jane ',
  },
  {
    id: 3,
    user: 'Jane@gmail1.com',
    text: 'some text made by Jane@gmail1.com ',
  },
  {
    id: 4,
    user: 'James@bond.com',
    text: 'some text made by James Once more ',
  },
];

// middleware authenticateFn
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
    next();
  });
}

// GET /auth/posts - gets all users from users table
router.get('/posts', authenticateToken, async (req, res) => {
  const userEmail = req.user;
  res.json({
    user: userEmail,
    posts: posts.filter((p) => p.user === userEmail),
  });
});

// POST /auth/register - creates new user with data in the body
router.post('/register', async (req, res) => {
  const { body } = req;

  // validate body using joi
  const validateResult = await validateRegister(body, res);
  if (validateResult === false) return;
  // export validate fn to external file
  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = `
    INSERT INTO users (email, password)
    VALUES ( ?, ? )
    `;
    // hash pass
    const result = await conn.execute(sql, [
      body.email,
      hashValue(body.password),
    ]);
    res.send({ msg: 'user created', result });
    await conn.end();
  } catch (error) {
    console.log('errro registering', error.message);
    res.status(500).send({ error: 'something went wrong' });
  }
});

// POST /auth/login - checks if user exists and if passswords match
router.post('/login', async (req, res) => {
  const { body } = req;

  // validate body using joi
  const validateResult = await validateRegister(body, res);
  if (validateResult === false) return;

  try {
    const conn = await mysql.createConnection(dbConfig);
    // check if we have a user email in our table
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [foundUser] = await conn.execute(sql, [body.email]);
    await conn.end();
    // console.log(foundUser);
    if (foundUser.length === 0) {
      throw new Error('user not found');
    }
    // if so, check if passwors match
    if (bcrypt.compareSync(body.password, foundUser[0].password)) {
      const userToBeEncrypted = {
        email: foundUser[0].email,
        userId: foundUser[0].id,
      };
      const token = jwt.sign(
        userToBeEncrypted,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' },
      );

      // eslint-disable-next-line consistent-return
      return res.json({
        msg: 'user found',
        foundUser: foundUser[0].email,
        token,
      });
    }
    throw new Error('password do not match');
  } catch (error) {
    // if no user found
    console.log('errror loging in', error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
