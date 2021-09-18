import axios from 'axios';
import { notifyError, notifyInfo } from './notify';
import { CREATE_CUSTOMER } from './types';

export const createCustomer = (data) => {
  return (dispatch) => {
    return axios
      .post('/customers', data)
      .then((res) => {
        dispatch({
          type: CREATE_CUSTOMER,
          payload: res.data,
        });
        dispatch(notifyInfo('Created Customer'));
      })
      .catch((err) => {
        dispatch(notifyError(JSON.stringify(err.response.data.message), err.response.status));
      });
  };
};
