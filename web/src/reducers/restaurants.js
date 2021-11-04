import {
  CLEAR_DISH_MEDIA,
  CLEAR_RESTAURANT_MEDIA,
  CREATE_DISH_MEDIA,
  CREATE_RESTAURANT,
  CREATE_RESTAURANT_DISH,
  CREATE_RESTAURANT_MEDIA,
  DELETE_RESTAURANT_DISH,
  FETCH_AUTH_RESTAURANT,
  UPDATE_RESTAURANT,
  UPDATE_RESTAURANT_DISH,
} from '../actions/types';

const initialState = {
  loginRestaurant: {},
  dishes: [],
  media: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUTH_RESTAURANT:
      return {
        ...state,
        loginRestaurant: action.payload,
        dishes: action.payload.dishes,
        media: action.payload.media,
      };

    case CREATE_RESTAURANT:
      return {
        ...state,
        loginRestaurant: action.payload,
        dishes: [],
        media: action.payload.media,
      };

    case UPDATE_RESTAURANT:
      return {
        ...state,
        loginRestaurant: action.payload,
        dishes: action.payload.dishes || [],
        media: action.payload.media,
      };

    case CREATE_RESTAURANT_MEDIA:
      return {
        ...state,
        media: [...state.media, action.payload],
      };

    case CLEAR_RESTAURANT_MEDIA:
      return {
        ...state,
        media: [],
      };

    case UPDATE_RESTAURANT_DISH:
      let updatedDishes = state.dishes.map((d) => {
        if (d._id == action.payload.dishID) {
          return action.payload.dish;
        } else {
          return d;
        }
      });
      return {
        ...state,
        dishes: updatedDishes,
      };

    case DELETE_RESTAURANT_DISH:
      let afterDeleteDishes = state.dishes.filter((d) => d._id != action.payload);
      return {
        ...state,
        dishes: afterDeleteDishes,
      };

    case CREATE_RESTAURANT_DISH:
      return {
        ...state,
        dishes: [...state.dishes, action.payload.dish],
      };

    case CREATE_DISH_MEDIA:
      let createddishes = state.dishes.map((d) => {
        if (d._id == action.payload.dishID) {
          d.media = [...d.media, action.payload.media];
        }
        return d;
      });
      return {
        ...state,
        dishes: createddishes,
      };

    case CLEAR_DISH_MEDIA:
      let cleareddishes = state.dishes.map((d) => {
        if (d._id == action.payload.dishID) {
          d.media = [];
        }
        return d;
      });
      return {
        ...state,
        dishes: cleareddishes,
      };

    default:
      return state;
  }
};
