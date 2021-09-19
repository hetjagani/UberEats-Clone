import axios from 'axios';
import { notifyError, notifyInfo } from './notify';
import { CREATE_CUSTOMER, CREATE_CUSTOMER_MEDIUM, FETCH_AUTH_CUSTOMER } from './types';

export const fetchAuthCustomer = (id, token) => {
  return (dispatch) => {
    return axios
      .get(`/customers/${id}`, {headers: {Authorization: token}})
      .then((res) => {
        dispatch({
          type: FETCH_AUTH_CUSTOMER,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch(notifyError(JSON.stringify(err.response.data.message), err.response.status));
      });
  };
};

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

export const createCustomerMedium = (data) => {
  return (dispatch) => {
    return axios
      .post('/customers/media', data)
      .then((res) => {
        dispatch({
          type: CREATE_CUSTOMER_MEDIUM,
          payload: res.data,
        });
        dispatch(notifyInfo('Created Customer Media'));
      })
      .catch((err) => {
        dispatch(notifyError(JSON.stringify(err.response.data.message), err.response.status));
      });
  };
};
