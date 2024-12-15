const { MONGODB_URL } = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogController');
const logger = require('./utils/logger');

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRouter);

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    res.status(400).json({ error: messages.join(', ') });
  }
  next(err);
});

module.exports = app;
