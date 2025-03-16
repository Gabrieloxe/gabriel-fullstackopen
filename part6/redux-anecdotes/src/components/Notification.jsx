import { useSelector } from 'react-redux';
import { Alert } from 'antd';

export const Notification = () => {
  const notification = useSelector(state => state.notification);
  if (!notification.visible || !notification.message) {
    return null;
  }
  return <Alert message={notification.message} type='info' closable='false' />;
};
