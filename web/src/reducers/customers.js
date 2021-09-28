import {
  CLEAR_CUSTOMER_MEDIUM,
  CREATE_CUSTOMER,
  CREATE_CUSTOMER_ADDRESS,
  CREATE_CUSTOMER_MEDIUM,
  DELETE_CUSTOMER_ADDRESS,
  FETCH_AUTH_CUSTOMER,
  UPDATE_CUSTOMER,
  UPDATE_CUSTOMER_ADDRESS,
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

    case CREATE_CUSTOMER_ADDRESS:
      return {
        ...state,
        addresses: [...state.addresses, action.payload],
      };

    case DELETE_CUSTOMER_ADDRESS:
      const afterDelete = state.addresses.filter((add) => add.id != action.payload);
      return {
        ...state,
        addresses: afterDelete,
      };

    case UPDATE_CUSTOMER_ADDRESS:
      const newAddresses = state.addresses.map((add) => {
        if (add.id == action.payload.id) {
          return action.payload;
        } else {
          return add;
        }
      });
      return {
        ...state,
        addresses: newAddresses,
      };

    default:
      return state;
  }
};
