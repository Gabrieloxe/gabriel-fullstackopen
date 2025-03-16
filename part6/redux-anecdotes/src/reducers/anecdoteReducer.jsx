import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

export const asObject = anecdote => {
  return {
    content: anecdote,
    votes: 0,
  };
};

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const likedAnecdote = action.payload;
      return state.map(anecdote =>
        anecdote.id !== likedAnecdote.id ? anecdote : likedAnecdote
      );
    },
    createAnecdote(state, action) {
      const newAnecdote = action.payload;
      state.push(newAnecdote);
    },
    appendAnecdote(state, action) {
      return [...state, action.payload];
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { vote, createAnecdote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

export const create = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const voteFor = anecdote => {
  return async dispatch => {
    const updateObject = { ...anecdote, votes: anecdote.votes + 1 };
    const updatedAnecdote = await anecdoteService.update(updateObject);
    dispatch(vote(updatedAnecdote));
  };
};

export default anecdoteSlice.reducer;
