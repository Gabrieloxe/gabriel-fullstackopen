import { Alert } from 'antd';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/notificationContext';

const Notification = () => {
  const { notification } = useContext(NotificationContext);

  if (!notification) {
    return null;
  }

  const alertType = notification.type === 'error' ? 'error' : 'info';

  return (
    <Alert
      message={notification.message}
      type={alertType}
      showIcon
      style={{ marginBottom: '20px' }}
    />
  );
};

export default Notification;