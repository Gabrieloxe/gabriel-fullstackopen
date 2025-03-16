import Notes from './components/Notes';
import NewNote from './components/NewNote';
import { VisbilityFilter } from './components/VisbilityFilter';
import { useEffect } from 'react';
import noteService from './services/notes';
import { setNotes } from './reducers/noteReducer';
import { useDispatch } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    noteService.getAll().then(notes => dispatch(setNotes(notes)));
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
