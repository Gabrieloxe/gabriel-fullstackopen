import { useSelector, useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { Button, List, Typography } from 'antd';
import Filter from './Filter';
import { voteFor } from '../reducers/anecdoteReducer';
import { Notification } from './Notification';
import { showNotification } from '../reducers/notificationReducer';

const Anecdotes = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(state => state.anecdotes);
  const filter = useSelector(state => state.filter);

  const sortedAndFilteredAnecdotes = useMemo(() => {
    return anecdotes
      .filter(anecdote =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => b.votes - a.votes);
  }, [anecdotes, filter]);

  const handleVote = id => {
    const anecdote = anecdotes.find(a => a.id === id);
    dispatch(voteFor(anecdote));
    dispatch(showNotification(`You voited '${anecdote.content}'`, 5));
  };

  return (
    <List
      header={
        <div>
          <h2>Anecdotes</h2>
          <Filter />
        </div>
      }
    >
      <Notification />
      {sortedAndFilteredAnecdotes.map(anecdote => (
        <List.Item key={anecdote.id}>
          <div>
            <Typography.Text mark>[{anecdote.votes} votes] </Typography.Text>
            {anecdote.content}
          </div>
          <div>
            <Button onClick={() => handleVote(anecdote.id)}>vote</Button>
          </div>
        </List.Item>
      ))}
    </List>
  );
};

export default Anecdotes;
