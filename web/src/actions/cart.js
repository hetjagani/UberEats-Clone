import axios from 'axios';
import notify from '../utils/notify';
import { ADD_DISH_TO_CART, FETCH_CART_ITEMS, REMOVE_DISH_FROM_CART } from './types';

export const fetchAllCartItems = (data) => {
  return (dispatch) => {
    return axios
      .get(`/cartitems`, data)
      .then((res) => {
        dispatch({
          type: FETCH_CART_ITEMS,
          payload: res.data,
        });
        // notify({ type: 'info', description: `Fetched all cart items` });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const addDishToCart = (data) => {
  return (dispatch) => {
    return axios
      .post(`/cartitems`, data)
      .then((res) => {
        dispatch({
          type: ADD_DISH_TO_CART,
          payload: res.data,
        });
        notify({ type: 'info', description: `Added dish ${res.data.dish.name} to cart.` });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const removeDishFromCart = (id) => {
  return (dispatch) => {
    return axios
      .delete(`/cartitems/${id}`)
      .then((res) => {
        dispatch({
          type: REMOVE_DISH_FROM_CART,
          payload: { itemId: id },
        });
        notify({ type: 'info', description: `Removed dish from cart` });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};
