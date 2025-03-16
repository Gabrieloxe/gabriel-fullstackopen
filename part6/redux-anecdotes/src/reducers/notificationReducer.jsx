import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
};

let timeoutId;

export const showNotification = (message, time = 5) => {
  return dispatch => {
    dispatch(setNotification(message));

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      dispatch(clearNotification());
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
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
