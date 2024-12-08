require('dotenv').config();
// Express
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

// mongo DB connection
const Note = require('./models/note');

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path: ', request.path);
  console.log('Body: ', request.body);
  console.log('---');
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static('build'));

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', async (request, response) => {
  try {
    const notes = await Note.find({});
    response.json(notes);
  } catch (e) {
    response.status(400).send({ message: e.message, status: false });
  }
});

app.post('/api/notes', async (request, response, next) => {
  try {
    const body = request.body;
    if (!body.content) {
      return response.status(400).json({
        error: 'content missing',
      });
    }

    const newNote = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    });

    const savedNote = await newNote.save();
    response.json(savedNote);
  } catch (e) {
    next(e);
  }
});

app.get('/api/notes/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const note = await Note.findById(id);
    response.json(note);
  } catch (e) {
    next(e);
  }
});

app.delete('/api/notes/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    await Note.findByIdAndDelete(id);
    response.status(204).end();
  } catch (e) {
    next(e);
  }
});

app.put('/api/notes/:id', async (request, response, next) => {
  try {
    const body = request.body;
    if (!body.content) {
      return response.status(400).json({
        error: 'content missing',
      });
    }
    const id = request.params.id;
    const noteUpdate = {
      content: body.content,
      date: new Date(),
      important: body.important || false,
    };
    const options = { new: true };
    const note = await Note.findOneAndReplace({ _id: id }, noteUpdate, options);
    response.json(note);
  } catch (e) {
    next(e);
  }
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log(`Server running on port ${PORT}`);
