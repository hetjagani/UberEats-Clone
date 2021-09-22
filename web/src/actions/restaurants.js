import axios from 'axios';
import notify from '../utils/notify';
import {
  CLEAR_DISH_MEDIA,
  CREATE_DISH_MEDIA,
  CREATE_RESTAURANT,
  CREATE_RESTAURANT_MEDIA,
  FETCH_AUTH_RESTAURANT,
  UPDATE_RESTAURANT_DISH,
} from './types';

export const fetchAuthRestaurant = (id, token) => {
  return (dispatch) => {
    return axios
      .get(`/restaurants/${id}`, { headers: { Authorization: token } })
      .then((res) => {
        dispatch({
          type: FETCH_AUTH_RESTAURANT,
          payload: res.data,
        });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const createRestaurant = (data) => {
  return (dispatch) => {
    return axios
      .post('/restaurants', data)
      .then((res) => {
        dispatch({
          type: CREATE_RESTAURANT,
          payload: res.data,
        });
        notify({ type: 'info', description: 'Created Restaurant' });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const createRestaurantMedia = (data) => {
  return (dispatch) => {
    return axios
      .post('/restaurants/media', data)
      .then((res) => {
        dispatch({
          type: CREATE_RESTAURANT_MEDIA,
          payload: res.data,
        });
        notify({ type: 'info', description: 'Created Restaurant Media' });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const updateRestaurantDish = (data, resID, dishID) => {
  return (dispatch) => {
    return axios
      .put(`/restaurants/${resID}/dishes/${dishID}`, data)
      .then((res) => {
        dispatch({
          type: UPDATE_RESTAURANT_DISH,
          payload: { dish: res.data, dishID },
        });
        notify({ type: 'info', description: 'Updated Restaurant Dish' });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const createDishMedia = (data, dishID) => {
  return (dispatch) => {
    return axios
      .post('/restaurants/media', data)
      .then((res) => {
        dispatch({
          type: CREATE_DISH_MEDIA,
          payload: { media: res.data, dishID },
        });
        notify({ type: 'info', description: 'Created Dish Media' });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const clearDishMedia = (dishID) => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_DISH_MEDIA,
      payload: { dishID },
    });
  };
};
