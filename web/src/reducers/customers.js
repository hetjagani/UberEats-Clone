import {
  ADD_CUSTOMER_FAVOURITE,
  CLEAR_CUSTOMER_MEDIUM,
  CREATE_CUSTOMER,
  CREATE_CUSTOMER_ADDRESS,
  CREATE_CUSTOMER_MEDIUM,
  DELETE_CUSTOMER_ADDRESS,
  DELETE_CUSTOMER_FAVOURITE,
  FETCH_AUTH_CUSTOMER,
  UPDATE_CUSTOMER,
  UPDATE_CUSTOMER_ADDRESS,
} from '../actions/types';

const initialState = {
  loginCustomer: {},
  medium: {},
  addresses: [],
  favourites: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_AUTH_CUSTOMER:
      return {
        ...state,
        loginCustomer: action.payload,
        medium: action.payload.medium,
        addresses: action.payload.addresses,
        favourites: action.payload.favourites,
      };

    case CREATE_CUSTOMER:
      return {
        ...state,
        loginCustomer: action.payload,
        medium: action.payload.medium,
      };

    case UPDATE_CUSTOMER:
      return {
        ...state,
        loginCustomer: action.payload,
        medium: action.payload.medium,
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
      const afterDelete = state.addresses.filter((add) => add._id != action.payload);
      return {
        ...state,
        addresses: afterDelete,
      };

    case UPDATE_CUSTOMER_ADDRESS:
      const newAddresses = state.addresses.map((add) => {
        if (add._id == action.payload._id) {
          return action.payload;
        } else {
          return add;
        }
      });
      return {
        ...state,
        addresses: newAddresses,
      };

    case ADD_CUSTOMER_FAVOURITE:
      return {
        ...state,
        favourites: [
          ...state.favourites,
          {
            restaurantId: action.payload.restaurantId,
            customerId: action.payload.customerId,
          },
        ],
      };

    case DELETE_CUSTOMER_FAVOURITE:
      const afterDeleteFavs = state.favourites.filter((fav) => fav.restaurantId != action.payload);
      return {
        ...state,
        favourites: afterDeleteFavs,
      };

    default:
      return state;
  }
};
