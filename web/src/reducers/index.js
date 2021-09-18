import { combineReducers } from 'redux';
import customerReducer from './customers';
import notifyReducer from './notify';

export default combineReducers({
  customers: customerReducer,
  notifications: notifyReducer,
});
