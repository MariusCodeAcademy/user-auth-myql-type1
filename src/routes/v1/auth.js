const express = require('express');
const bcrypt = require('bcryptjs');
const joi = require('joi');

const router = express.Router();

const mysql = require('mysql2/promise');
const dbConfig = require('../../dbConfig');

// GET /auth - gets all users from users table
router.get('/', async (req, res) => {
  res.send('get all users');
});

// POST /auth/register - creates new user with data in the body
router.post('/register', async (req, res) => {
  const { body } = req;

  // validate body using joi
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  try {
    await schema.validateAsync(body, { abortEarly: false });
  } catch (error) {
    console.warn(error);
    return res.status(400).send({
      error: error.details.map((e) => ({
        errorMsg: e.message,
        field: e.context.key,
      })),
    });
  }
  // export validate fn to external file
  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = `
    INSERT INTO users (email, password)
    VALUES ( ?, ? )
    `;
    // hash pass
    const hashedPass = bcrypt.hashSync(body.password, 8);
    console.log('hashedPass', hashedPass);
    const result = await conn.execute(sql, [body.email, hashedPass]);
    res.send({ msg: 'user created', result });
    await conn.end();
  } catch (error) {
    console.log('errro registering', error.message);
    res.status(500).send({ error: 'something went wrong' });
  }
});

module.exports = router;
