import { NOTIFY } from '../actions/types';

const initialState = {
  type: null,
  message: null,
  description: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NOTIFY:
      return {
        ...state,
        type: action.payload.type,
        message: action.payload.title,
        description: action.payload.message,
      };

    default:
      return state;
  }
};
