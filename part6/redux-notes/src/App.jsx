import Notes from './components/Notes';
import NewNote from './components/NewNote';
import { VisbilityFilter } from './components/VisbilityFilter';

const App = () => {
  return (
    <div>
      <NewNote />
      <VisbilityFilter />
      <Notes />
    </div>
  );
};

export default App;
