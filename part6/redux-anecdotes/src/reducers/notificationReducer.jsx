import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  visible: false,
};

let timeoutId;

export const showNotification = (message, time = 5) => {
  return async dispatch => {
    dispatch(setNotification(message));
    dispatch(setVisible(true));

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      dispatch(clearNotification());
      dispatch(setVisible(false));
    }, time * 1000);
  };
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      state.message = action.payload;
    },
    clearNotification(state) {
      state.message = null;
    },
    setVisible(state, action) {
      state.visible = action.payload;
    },
  },
});

export const { setNotification, clearNotification, setVisible } =
  notificationSlice.actions;
export default notificationSlice.reducer;
