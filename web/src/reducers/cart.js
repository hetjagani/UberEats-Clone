import { ADD_DISH_TO_CART } from '../actions/types';

const initialState = {
  restaurant: {},
  dishes: [], //{dish, quantity, notes}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_DISH_TO_CART:
      return {
        ...state,
        restaurant: action.payload.restaurant,
        dishes: [
          ...state.dishes,
          {
            dish: action.payload.dish,
            quantity: action.payload.quantity,
            notes: action.payload.notes,
          },
        ],
      };
    default:
      return state;
  }
};
