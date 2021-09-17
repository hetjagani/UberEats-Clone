import { CREATE_CUSTOMER } from '../actions/types';

const initialState = {
  customer: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CUSTOMER:
      console.log(customer);
      return {
        ...state,
        customer: action.payload,
      };

    default:
      return state;
  }
};
