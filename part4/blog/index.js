const { PORT, MONGODB_URI } = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogController');
const logger = require('./utils/logger')

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRouter);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
