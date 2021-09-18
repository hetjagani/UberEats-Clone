import { CREATE_RESTAURANT } from "../actions/types";


const initialState = {
  restaurant: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_RESTAURANT:
      return {
        ...state,
        restaurant: action.payload,
      };

    default:
      return state;
  }
};
