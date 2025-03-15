import '@ant-design/v5-patch-for-react-19';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import noteReducer from './reducers/noteReducer';
import filterReducer from './reducers/fiilterReducer';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer,
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
