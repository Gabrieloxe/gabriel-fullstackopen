import { useDispatch } from 'react-redux';
import { Input, Button, Form } from 'antd';
import { create } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async values => {
    const content = values.anecdote;
    dispatch(create(content));
    dispatch(showNotification(`You created '${content}'`, 5));
    form.resetFields();
  };

  return (
    <div>
      <h2>create new</h2>
      <Form
        form={form}
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item
          label='Create new Anecdote'
          name='anecdote'
          rules={[{ required: true, message: 'Please input an anecdote!' }]}
        >
          <Input />
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
