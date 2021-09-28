import axios from 'axios';
import notify from '../utils/notify';
import {
  CLEAR_CUSTOMER_MEDIUM,
  CREATE_CUSTOMER,
  CREATE_CUSTOMER_MEDIUM,
  FETCH_AUTH_CUSTOMER,
  UPDATE_CUSTOMER,
} from './types';

export const fetchAuthCustomer = (id, token) => {
  return (dispatch) => {
    return axios
      .get(`/customers/${id}`, { headers: { Authorization: token } })
      .then((res) => {
        dispatch({
          type: FETCH_AUTH_CUSTOMER,
          payload: res.data,
        });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
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
        notify({ type: 'info', description: 'Created Customer' });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
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
        notify({ type: 'info', description: 'Created Customer Media' });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const clearCustomerMedium = (data) => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_CUSTOMER_MEDIUM,
      payload: null,
    });
  };
};

export const updateCustomer = (data, id) => {
  return (dispatch) => {
    return axios
      .put(`/customers/${id}`, data)
      .then((res) => {
        dispatch({
          type: UPDATE_CUSTOMER,
          payload: res.data,
        });
        notify({ type: 'info', description: 'Update Customer Details' });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};
