import { useDispatch, useSelector } from 'react-redux';
import { toggleImportanceOf } from '../reducers/noteReducer';
import { List, Typography } from 'antd';

const Note = ({ note, handleClick }) => {
  return (
    <List.Item onClick={handleClick}>
      <Typography.Text mark>
        {note.important ? '[important] ' : ''}
      </Typography.Text>
      {note.content}
    </List.Item>
  );
};

const Notes = () => {
  const dispatch = useDispatch();
  const notes = useSelector(state => {
    switch (state.filter) {
      case 'IMPORTANT':
        return state.notes.filter(note => note.important);
      case 'NON-IMPORTANT':
        return state.notes.filter(note => !note.important);
      default:
        return state.notes;
    }
  });

  return (
    <List>
      {notes.map(note => (
        <Note
          key={note.id}
          note={note}
          handleClick={() => dispatch(toggleImportanceOf(note.id))}
        />
      ))}
    </List>
  );
};

export default Notes;
