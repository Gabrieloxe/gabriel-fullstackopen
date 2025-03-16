import noteReducer from './reducers/noteReducer';
import filterReducer from './reducers/fiilterReducer';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer,
  },
});

export default store;
