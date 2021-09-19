import { CREATE_RESTAURANT, CREATE_RESTAURANT_MEDIA } from '../actions/types';

const initialState = {
  restaurant: {},
  media: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_RESTAURANT:
      return {
        ...state,
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
