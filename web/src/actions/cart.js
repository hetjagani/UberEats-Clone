import axios from 'axios';
import notify from '../utils/notify';
import {
  ADD_DISH_TO_CART,
  CLEAR_CART,
  DIFF_RESTAURANT_ERROR,
  FETCH_CART_ITEMS,
  PLACE_ORDER,
  REMOVE_DISH_FROM_CART,
  UPDATE_CART_ITEM,
} from './types';

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
        console.log(err);
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
        if (err.response.data.type && err.response.data.type == 'diff_restaurant') {
          dispatch({
            type: DIFF_RESTAURANT_ERROR,
            payload: err.response.data,
          });
        }
      });
  };
};

export const updateItemInCart = (data, itemId) => {
  return (dispatch) => {
    return axios
      .put(`/cartitems/${itemId}`, data)
      .then((res) => {
        dispatch({
          type: UPDATE_CART_ITEM,
          payload: res.data,
        });
        notify({ type: 'info', description: `Updated dish ${res.data.dish.name} in cart.` });
      })
      .catch((err) => {
        console.log(err);
        notify({ type: 'error', description: JSON.stringify(err.response?.data?.message) });
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

export const placedOrder = () => {
  return (dispatch) => {
    dispatch({
      type: PLACE_ORDER,
      payload: null,
    });
  };
};

export const clearCart = () => {
  return (dispatch) => {
    return axios
      .delete(`/cartitems/reset`)
      .then((res) => {
        dispatch({
          type: CLEAR_CART,
          payload: null,
        });
        notify({ type: 'info', description: 'Cleared Cart' });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};
