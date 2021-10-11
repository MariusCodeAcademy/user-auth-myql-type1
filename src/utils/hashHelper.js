const bcrypt = require('bcryptjs');

function hashValue(plainValue) {
  return bcrypt.hashSync(plainValue, 10);
}

function decodeHash() {}

module.exports = {
  hashValue,
  decodeHash,
};
