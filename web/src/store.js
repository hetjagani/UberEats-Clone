import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import axiosAuth from './utils/axiosAuth';
import rootReducer from './reducers';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk];

export default () => {
  const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(...middleware, axiosAuth)),
  );
  let persistor = persistStore(store);
  return { store, persistor };
};
