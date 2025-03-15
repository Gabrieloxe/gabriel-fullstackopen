import { expect } from 'vitest';
import anecdoteReducer from './anecdoteReducer';
import deepFreeze from 'deep-freeze';

describe('anecdoteReducer', () => {
  test('returns new state with action NEW_ANECDOTE', () => {
    const state = [];

    const action = {
      type: 'anecdotes/create',
      payload: 'If it hurts, do it more often',
    };

    deepFreeze(state);
    const newState = anecdoteReducer(state, action);
    expect(newState).toHaveLength(1);
    expect(newState.map(s => s.content)).toContainEqual(action.payload);
  });

  test('returns new state with action VOTE', () => {
    const state = [
      {
        content: 'If it hurts do it more often',
        id: 1,
        votes: 0,
      },
    ];
    deepFreeze(state);
    const action = {
      type: 'anecdotes/vote',
      payload: 1,
    };
    const newState = anecdoteReducer(state, action);
    expect(newState[0].votes).toBe(1);
  });
});
