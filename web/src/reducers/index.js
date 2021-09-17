import { combineReducers } from 'redux';
import customerReducer from './customers';
import errorReducer from './error';

export default combineReducers({
  customers: customerReducer,
  errors: errorReducer,
});
