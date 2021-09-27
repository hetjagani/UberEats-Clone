import { combineReducers } from 'redux';
import customerReducer from './customers';
import restaurantReducer from './restaurants';
import cartReducer from './cart';

export default combineReducers({
  customers: customerReducer,
  restaurants: restaurantReducer,
  cart: cartReducer,
});
