import { CREATE_CUSTOMER, CREATE_CUSTOMER_MEDIUM } from '../actions/types';

const initialState = {
  customer: {},
  medium: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CUSTOMER:
      return {
        ...state,
        customer: action.payload,
      };

    case CREATE_CUSTOMER_MEDIUM:
      return {
        ...state,
        medium: action.payload,
      };

    default:
      return state;
  }
};
