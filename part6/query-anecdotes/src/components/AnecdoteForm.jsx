import { Form, Input, Button, Typography } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnecdote } from '../requests';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/notificationContext';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useContext(NotificationContext);

  const onCreate = values => {
    const content = values.anecdote;
    newAnecdoteMutation.mutate(content);
    form.resetFields();
  };

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: { message: 'Anecdote created successfully!', type: 'info' },
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
    onError: error => {
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: {
          message: `Error: ${error.response?.data?.error || error.message}`,
          type: 'error',
        },
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
  });

  const [form] = Form.useForm();

  return (
    <div>
      <Typography.Title level={3}>Create New Anecdote</Typography.Title>
      <Form
        form={form}
        onFinish={onCreate}
        layout="vertical"
        style={{ maxWidth: '400px', margin: '0 auto' }}
      >
        <Form.Item name="anecdote" label="Anecdote">
          <Input placeholder="Enter your anecdote" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AnecdoteForm;