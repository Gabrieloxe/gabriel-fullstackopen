require('dotenv').config();

const PORT = process.env.PORT;

const MONGODB_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const SECRET = process.env.SECRET;
module.exports = {
  MONGODB_URL,
  PORT,
  SECRET,
};
