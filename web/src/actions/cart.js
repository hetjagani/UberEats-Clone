import axios from 'axios';
import notify from '../utils/notify';
import { ADD_DISH_TO_CART } from './types';

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
