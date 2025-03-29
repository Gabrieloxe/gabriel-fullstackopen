import axios from 'axios';

const getAnecdotes = async () => {
  try {
    const response = await axios.get('http://localhost:3001/anecdotes');
    return response.data;
  } catch (error) {
    throw new Error('anecdote service not available due to problems in server');
  }
};

const createAnecdote = async content => {
  const response = await axios.post('http://localhost:3001/anecdotes', {
    content,
    votes: 0,
  });
  return response.data;
};

const updateAnecdote = async updatedAnecdote => {
  const response = await axios.put(
    `http://localhost:3001/anecdotes/${updatedAnecdote.id}`,
    updatedAnecdote
  );
  return response.data;
};

export { getAnecdotes, createAnecdote, updateAnecdote };
