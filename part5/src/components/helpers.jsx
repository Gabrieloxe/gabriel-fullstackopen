export const notify = (message, type = 'success') => {
  setNotification({ message, type });
  setTimeout(() => {
    setNotification(null);
  }, 5000);
};

