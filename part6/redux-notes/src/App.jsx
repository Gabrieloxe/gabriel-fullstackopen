import Notes from './components/Notes';
import NewNote from './components/NewNote';
import { VisbilityFilter } from './components/VisbilityFilter';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeNotes } from './reducers/noteReducer';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeNotes());
  }, []);
  return (
    <div>
      <NewNote />
      <VisbilityFilter />
      <Notes />
    </div>
  );
};

export default App;
