import ReactDOM from 'react-dom/client';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { filterChange } from './reducers/fiilterReducer';
import { createNote } from './reducers/noteReducer';
import noteReducer from './reducers/noteReducer';
import filterReducer from './reducers/fiilterReducer';
import App from './App';

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer,
});

const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));
store.dispatch(filterChange('IMPORTANT'));
store.dispatch(
  createNote('combineReducers forms one reducer from many simple reducers')
);
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
