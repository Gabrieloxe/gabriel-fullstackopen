import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotes, createNote, updateNote } from './requests';
import { Form, Input, Button, List, Typography, Tag, Spin } from 'antd';

const App = () => {
  const queryClient = useQueryClient();
  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: newNote => {
      const notes = queryClient.getQueryData({ queryKey: ['notes'] });
      queryClient.setQueryData({ queryKey: ['notes'] }, notes.concat(newNote));
    },
  });
  const addNote = async event => {
    event.preventDefault();
    const content = event.target.note.value;
    event.target.note.value = '';
    newNoteMutation.mutate({ content, important: true });
  };

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: updatedNote => {
      const notes = queryClient.getQueryData({ queryKey: ['notes'] });
      queryClient.setQueryData(
        { queryKey: ['notes'] },
        notes.map(note => (note.id !== updatedNote.id ? note : updatedNote))
      );
    },
  });

  const toggleImportance = note => {
    updateNoteMutation.mutate({ ...note, important: !note.important });
  };

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false,
  });

  if (result.isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Spin size='large' tip='Loading data...' />
      </div>
    );
  }

  const notes = result.data;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Typography.Title level={2}>Notes App</Typography.Title>
      <Form onFinish={addNote} layout='inline' style={{ marginBottom: '20px' }}>
        <Form.Item
          name='note'
          rules={[{ required: true, message: 'Please input a note!' }]}
        >
          <Input placeholder='Enter a note' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Add
          </Button>
        </Form.Item>
      </Form>
      <List
        bordered
        dataSource={notes}
        renderItem={note => (
          <List.Item
            onClick={() => toggleImportance(note)}
            style={{ cursor: 'pointer' }}
          >
            <Typography.Text>{note.content}</Typography.Text>
            {note.important && (
              <Tag color='red' style={{ marginLeft: '10px' }}>
                Important
              </Tag>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default App;
