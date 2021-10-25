import {
  ADD_DISH_TO_CART,
  CLEAR_CART,
  DIFF_RESTAURANT_ERROR,
  FETCH_CART_ITEMS,
  PLACE_ORDER,
  REMOVE_DISH_FROM_CART,
  UPDATE_CART_ITEM,
} from '../actions/types';

const initialState = {
  restaurant: {},
  dishes: [], //{dish, quantity, notes}
  diffRestaurantError: {},
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
            itemId: action.payload._id,
            dish: action.payload.dish,
            quantity: action.payload.quantity,
            notes: action.payload.notes,
          },
        ],
      };

    case UPDATE_CART_ITEM:
      const updatedItems = state.dishes.map((item) => {
        if (item.itemId == action.payload._id) {
          return {
            itemId: action.payload._id,
            dish: action.payload.dish,
            quantity: action.payload.quantity,
            notes: action.payload.notes,
          };
        } else {
          return item;
        }
      });
      return {
        ...state,
        dishes: updatedItems,
      };

    case FETCH_CART_ITEMS:
      const nextState = { ...state };
      if (action.payload && action.payload.length > 0) {
        nextState.restaurant = action.payload[0].restaurant;
      }
      const newDishes = [];
      action.payload.forEach((item) => {
        newDishes.push({
          itemId: item._id,
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

    case CLEAR_CART:
      return {
        ...state,
        dishes: [],
        restaurant: {},
      };

    case DIFF_RESTAURANT_ERROR:
      return {
        ...state,
        diffRestaurantError: action.payload,
      };
    default:
      return state;
  }
};
