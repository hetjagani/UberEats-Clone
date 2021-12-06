import axios from 'axios';
import { getCookie } from 'react-use-cookie';
import notify from '../utils/notify';
import query from '../utils/graphql/query';
import { createCustomer as createCustomerQ } from '../mutations/mutations';

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
    return query(createCustomerQ, { customer: data })
      .then((res) => {
        dispatch({
          type: CREATE_CUSTOMER,
          payload: res.createCustomer,
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
    dispatch({
      type: CREATE_CUSTOMER_MEDIUM,
      payload: data,
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

export const createCustomerAddress = (data) => {
  return (dispatch) => {
    return axios
      .post(`/customers/addresses`, data)
      .then((res) => {
        dispatch({
          type: CREATE_CUSTOMER_ADDRESS,
          payload: res.data,
        });
        notify({ type: 'info', description: `Added Customer address of ${res.data.city} city` });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const updateCustomerAddress = (data, addID) => {
  return (dispatch) => {
    return axios
      .put(`/customers/addresses/${addID}`, data)
      .then((res) => {
        dispatch({
          type: UPDATE_CUSTOMER_ADDRESS,
          payload: res.data,
        });
        notify({ type: 'info', description: `Updated Customer address of ${res.data.city} city` });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const deleteCustomerAddress = (addID) => {
  return (dispatch) => {
    return axios
      .delete(`/customers/addresses/${addID}`)
      .then((res) => {
        dispatch({
          type: DELETE_CUSTOMER_ADDRESS,
          payload: addID,
        });
        notify({ type: 'info', description: `Deleted customer address` });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const addCustomerFavourite = (data) => {
  return (dispatch) => {
    return axios
      .post(`/customers/favourites`, data)
      .then((res) => {
        dispatch({
          type: ADD_CUSTOMER_FAVOURITE,
          payload: res.data,
        });
        notify({ type: 'info', description: `Added ${res.data.restaurant.name} to favourites` });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const deleteCustomerFavourite = (id) => {
  return (dispatch) => {
    return axios
      .delete(`/customers/favourites/${id}`)
      .then((res) => {
        dispatch({
          type: DELETE_CUSTOMER_FAVOURITE,
          payload: id,
        });
        notify({ type: 'info', description: `Deleted from favourites` });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};
