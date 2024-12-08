import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
  getContact,
} from './mongo.js';

const requestLogger = (req, res, next) => {
  morgan.token('body', req => {
    if (req.body) {
      return JSON.stringify(req.body);
    }
    return '';
  });

  morgan(':method :url :status :res[content-length] - :response-time ms :body')(
    req,
    res,
    next
  );
};

const app = express();
app.use(express.static('dist'));
app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get('/info', async (request, response) => {
  try {
    const contacts = await getContacts();
    const info = `Phonebook has info for ${
      contacts.length
    } people. </br></br> ${new Date()}`;
    response.send(info);
  } catch (error) {
    response.status(500).send({ error });
  }
});

app.get('/api/persons', async (req, res) => {
  try {
    const contacts = await getContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const contact = await getContact(request.params.id);

    if (contact) {
      response.json(contact);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

app.post('/api/persons', async (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: 'Name or number is missing' });
  }

  try {
    const newContact = await createContact(name, number);
    response.json(newContact);
  } catch (error) {
    next(error);
  }
});

app.put('/api/persons/:id', async (request, response) => {
  const { id } = request.params;
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: 'Name or number is missing' });
  }

  try {
    const updatedContact = await updateContact(id, { name, number });
    if (updatedContact) {
      response.json(updatedContact);
    } else {
      response.status(404).send({ error: 'Contact not found' });
    }
  } catch (error) {
    response.status(500).send({ error });
  }
});

app.delete('/api/persons/:id', async (request, response) => {
  try {
    const deletedContact = await deleteContact(request.params.id);
    if (deletedContact) {
      response.status(204).end();
    } else {
      response.status(404).send({ error: 'Contact not found' });
    }
  } catch (error) {
    response.status(500).send({ error });
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  console.error(error.name);
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

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
