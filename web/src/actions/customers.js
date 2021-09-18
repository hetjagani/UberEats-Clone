import axios from 'axios';
import { notifyError } from './notify';
import { CREATE_CUSTOMER, ERROR } from './types';

export const createCustomer = (data) => {
  return (dispatch) => {
    return axios
      .post('/customers', data)
      .then((res) => {
        dispatch({
          type: CREATE_CUSTOMER,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch(notifyError(JSON.stringify(err.response.data.message), err.response.status));
      });
  };
};
