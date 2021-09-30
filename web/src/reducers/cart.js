import {
  ADD_DISH_TO_CART,
  FETCH_CART_ITEMS,
  PLACE_ORDER,
  REMOVE_DISH_FROM_CART,
} from '../actions/types';

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
            itemId: action.payload.id,
            dish: action.payload.dish,
            quantity: action.payload.quantity,
            notes: action.payload.notes,
          },
        ],
      };
    case FETCH_CART_ITEMS:
      const nextState = { ...state };
      if (action.payload && action.payload.length > 0) {
        nextState.restaurant = action.payload[0].restaurant;
      }
      const newDishes = [];
      action.payload.forEach((item) => {
        newDishes.push({
          itemId: item.id,
          dish: item.dish,
          quantity: item.quantity,
          notes: item.notes,
        });
      });
      nextState.dishes = newDishes;
      return nextState;

    case REMOVE_DISH_FROM_CART:
      let afterRemove = state.dishes.filter((item) => item.itemId != action.payload.itemId);
      return {
        ...state,
        dishes: afterRemove,
      };

    case PLACE_ORDER:
      return {
        ...state,
        dishes: [],
        restaurant: {},
      };
    default:
      return state;
  }
};
