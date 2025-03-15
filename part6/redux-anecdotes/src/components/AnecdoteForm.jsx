import { useDispatch } from 'react-redux';
import { create } from '../reducers/anecdoteReducer';
import { Input, Button, Form } from 'antd';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const createAnecdote = event => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    dispatch(create(content));
  };

  return (
    <div>
      <h2>create new</h2>
      <Form
        onSubmit={createAnecdote}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item label='Create new Anecdote'>
          <Input name='anecdote' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AnecdoteForm;
