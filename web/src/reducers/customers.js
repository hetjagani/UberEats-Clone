import {
  CLEAR_CUSTOMER_MEDIUM,
  CREATE_CUSTOMER,
  CREATE_CUSTOMER_MEDIUM,
  FETCH_AUTH_CUSTOMER,
  UPDATE_CUSTOMER,
} from '../actions/types';

const initialState = {
  loginCustomer: {},
  medium: {},
  addresses: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUTH_CUSTOMER:
      return {
        ...state,
        loginCustomer: action.payload,
        medium: action.payload.medium,
        addresses: action.payload.addresses,
      };

    case CREATE_CUSTOMER:
      return {
        ...state,
        loginCustomer: action.payload,
        medium: action.payload.medium,
        addresses: action.payload.addresses,
      };

    case UPDATE_CUSTOMER:
      return {
        ...state,
        loginCustomer: action.payload,
        medium: action.payload.medium,
        addresses: action.payload.addresses,
      };

    case CREATE_CUSTOMER_MEDIUM:
      return {
        ...state,
        medium: action.payload,
      };

    case CLEAR_CUSTOMER_MEDIUM:
      return {
        ...state,
        medium: {},
      };

    default:
      return state;
  }
};
