const express = require('express');
const bcrypt = require('bcryptjs');
const joi = require('joi');

const router = express.Router();

const mysql = require('mysql2/promise');
const dbConfig = require('../../dbConfig');

const { hashValue } = require('../../utils/hashHelper');
const { validateRegister } = require('../../utils/validateHelper');

// GET /auth - gets all users from users table
router.get('/', async (req, res) => {
  res.send('get all users');
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

module.exports = router;
