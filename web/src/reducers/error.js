import { ERROR } from '../actions/types';

const initialState = {
  error: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
