import { combineReducers } from 'redux';
import customerReducer from './customers';
import restaurantReducer from './restaurants';
import notifyReducer from './notify';

export default combineReducers({
  customers: customerReducer,
  restaurants: restaurantReducer,
  notifications: notifyReducer,
});
