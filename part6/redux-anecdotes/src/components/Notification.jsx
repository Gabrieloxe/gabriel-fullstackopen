import { useSelector } from 'react-redux';
import { Alert } from 'antd';

export const Notification = () => {
  const message = useSelector(state => state.notification.message);
  if (!message) {
    return null;
  }
  return <Alert message={message} type='info' closable={false} />;
};
