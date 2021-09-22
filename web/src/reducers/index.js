import { combineReducers } from 'redux';
import customerReducer from './customers';
import restaurantReducer from './restaurants';

export default combineReducers({
  customers: customerReducer,
  restaurants: restaurantReducer,
});
