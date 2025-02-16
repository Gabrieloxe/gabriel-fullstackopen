const noteReducer = (state = [], action) => {
  if (action.type === 'NEW_NOTE') {
    return [...state, action.payload];
  }

  if (action.type === 'TOGGLE_IMPORTANCE') {
    const id = action.payload.id;
    const noteToChange = state.find(n => n.id === id);
    const changedNote = {
      ...noteToChange,
      important: !noteToChange.important,
    };
    return state.map(note => (note.id !== id ? note : changedNote));
  }

  return state;
};

export default noteReducer;
