const { MONGODB_URL } = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
} = require('./utils/middleware');
const blogRouter = require('./controllers/blogRouter');
const usersRouter = require('./controllers/userRouter');
const loginRouter = require('./controllers/loginRouter');

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
app.use(tokenExtractor);
app.use('/api/blogs', userExtractor, blogRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);
app.use(unknownEndpoint);

module.exports = app;
