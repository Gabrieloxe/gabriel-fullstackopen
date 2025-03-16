import AnecdoteForm from './components/AnecdoteForm';
import Anecdotes from './components/Anecdotes';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { initializeAnecdotes } from './reducers/anecdoteReducer';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, [dispatch]);

  return (
    <div>
      <Anecdotes />
      <AnecdoteForm />
    </div>
  );
};

export default App;
