import React from 'react';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnecdotes, updateAnecdote } from './requests';
import { List, Typography, Button, Spin, Alert } from 'antd';
import _ from 'lodash';
import useNotification from './hooks/useNotification';

const App = () => {
  const queryClient = useQueryClient();
  const { notification, dispatch } = useNotification();

  const handleVote = anecdote => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    updateAnecdoteMutation.mutate(updatedAnecdote);

    // Dispatch notification
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: { message: `You voted for '${anecdote.content}'`, type: 'info' },
    });
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' });
    }, 5000);
  };

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
    },
  });

  const {
    isLoading,
    isError,
    data: anecdotes,
    error,
  } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Spin size='large' tip='Loading anecdotes...' />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Alert message={error.message} type='error' />
      </div>
    );
  }

  const sortedAnecdotes = _.orderBy(anecdotes, ['votes'], ['desc']);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Typography.Title level={2}>Anecdote App</Typography.Title>

      <Notification notification={notification} />
      <AnecdoteForm />

      <List
        bordered
        dataSource={sortedAnecdotes}
        renderItem={anecdote => (
          <List.Item
            actions={[
              <Button
                type='primary'
                onClick={() => handleVote(anecdote)}
                key='vote'
              >
                Vote
              </Button>,
            ]}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: 1 }}>
              <Typography.Text>{anecdote.content}</Typography.Text>
            </div>
            <div
              style={{
                marginLeft: '20px',
                textAlign: 'right',
                minWidth: '80px',
              }}
            >
              <Typography.Text>
                <strong>Votes:</strong> {anecdote.votes}
              </Typography.Text>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default App;
