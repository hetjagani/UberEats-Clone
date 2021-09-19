import {
  CREATE_RESTAURANT,
  CREATE_RESTAURANT_MEDIA,
  FETCH_AUTH_RESTAURANT,
} from '../actions/types';

const initialState = {
  loginRestaurant: {},
  restaurant: {},
  media: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUTH_RESTAURANT:
      return {
        ...state,
        loginRestaurant: action.payload,
      };
    case CREATE_RESTAURANT:
      return {
        ...state,
        loginRestaurant: action.payload,
        restaurant: action.payload,
      };

    case CREATE_RESTAURANT_MEDIA:
      return {
        ...state,
        media: [...state.media, action.payload],
      };

    default:
      return state;
  }
};
