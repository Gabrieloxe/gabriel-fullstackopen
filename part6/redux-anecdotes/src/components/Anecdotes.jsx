import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { Button, List, Typography } from 'antd';
import Filter from './Filter';

const Anecdotes = () => {
  const dispatch = useDispatch();

  const vote = id => {
    dispatch(voteAnecdote(id));
  };

  const filteredAnecdotes = useSelector(state => {
    const filter = state.filter;
    return state.anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const sortedAnecdotes = filteredAnecdotes.sort((a, b) => b.votes - a.votes);

  return (
    <List
      header={
        <div>
          <h2>Anecdotes</h2>
          <Filter />
        </div>
      }
    >
      {sortedAnecdotes.map(anecdote => (
        <List.Item key={anecdote.id}>
          <div>
            <Typography.Text mark>[{anecdote.votes} votes] </Typography.Text>
            {anecdote.content}
          </div>
          <div>
            <Button onClick={() => vote(anecdote.id)}>vote</Button>
          </div>
        </List.Item>
      ))}
    </List>
  );
};

export default Anecdotes;
