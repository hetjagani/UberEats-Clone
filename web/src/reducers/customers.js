import { CREATE_CUSTOMER, CREATE_CUSTOMER_MEDIUM, FETCH_AUTH_CUSTOMER } from '../actions/types';

const initialState = {
  loginCustomer: {},
  customer: {},
  medium: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUTH_CUSTOMER:
      return {
        ...state,
        loginCustomer: action.payload,
      };

    case CREATE_CUSTOMER:
      return {
        ...state,
        loginCustomer: action.payload,
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
