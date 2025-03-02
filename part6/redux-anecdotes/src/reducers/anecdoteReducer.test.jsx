import { expect } from 'vitest';
import { reducer } from './anecdoteReducer';
import deepFreeze from 'deep-freeze';

describe('anecdoteReducer', () => {
  test('returns new state with action NEW_ANECDOTE', () => {
    const state = [];

    const action = {
      type: 'CREATE',
      payload: {
        content: 'If it hurts, do it more often',
      },
    };

    deepFreeze(state);
    const newState = reducer(state, action);
    expect(newState).toHaveLength(1);
    expect(newState[0].content).toBe('If it hurts, do it more often');
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
      type: 'VOTE',
      payload: {
        id: 1,
      },
    };
    const newState = reducer(state, action);
    expect(newState[0].votes).toBe(1);
  });
});
