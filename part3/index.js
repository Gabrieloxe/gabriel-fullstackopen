const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', req => {
  if (req.body) {
    return JSON.stringify(req.body);
  }
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-643122',
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
}); 

app.get('/info', (request, response) => {
  const info = `Phonebook has info for ${
    persons.length
  } people. </br></br> ${new Date()}`;

  response.send(info);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number || body.name === '' || body.number === '') {
    response.status(400).json({
      error: 'Either the name or number is missing',
    });
  }

  const names = persons.map(p => p.name);
  if (names.includes(body.name)) {
    response.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const idExist = persons.find(p => p.id === id);

  if (!idExist) {
    response.status(404).end();
  }

  const body = request.body;

  if (!body.name || !body.number || body.name === '' || body.number === '') {
    return response.status(400).json({
      error: 'Either the name or number is missing',
    });
  }

  persons = persons.filter(p => p.id !== id);
  const person = {
    id,
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});

const generateId = () => {
  let id = Math.floor(Math.random() * 1000000);
  const numbers = persons.map(p => p.id);
  while (numbers.includes(id)) {
    id = Math.floor(Math.random() * 1000000);
  }
  return id;
};

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(p => p.id !== id);
  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
