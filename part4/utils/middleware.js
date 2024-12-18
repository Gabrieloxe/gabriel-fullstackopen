const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('./config');

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' });
  } else if ((error.name = 'JsonWebTokenError')) {
    return response.status(401).json({ error: error.message });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const token = request.token;
  if (token) {
    const decodedToken = jwt.verify(token, config.SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(401).json({
        error: 'token is invalid or no user was found for token',
      });
    }
    request.user = user;
  } else {
    return response.status(401).json({
      error: 'unauthorized, token is missing',
    });
  }

  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
};
