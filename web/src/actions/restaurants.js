import axios from 'axios';
import { getCookie, setCookie } from 'react-use-cookie';
import notify from '../utils/notify';
import {
  CLEAR_DISH_MEDIA,
  CLEAR_RESTAURANT_MEDIA,
  CREATE_DISH_MEDIA,
  CREATE_RESTAURANT,
  CREATE_RESTAURANT_DISH,
  CREATE_RESTAURANT_MEDIA,
  DELETE_RESTAURANT_DISH,
  FETCH_AUTH_RESTAURANT,
  UPDATE_RESTAURANT,
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
    const token = getCookie('auth');
    return axios
      .post('/restaurants', data, { headers: { Authorization: token } })
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

export const updateRestaurant = (data, id) => {
  return (dispatch) => {
    return axios
      .put(`/restaurants/${id}`, data)
      .then((res) => {
        dispatch({
          type: UPDATE_RESTAURANT,
          payload: res.data,
        });
        notify({ type: 'info', description: 'Updated Restaurant Details' });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const createRestaurantMedia = (data) => {
  return (dispatch) => {
    dispatch({
      type: CREATE_RESTAURANT_MEDIA,
      payload: data,
    });
  };
};

export const clearRestaurantMedia = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_RESTAURANT_MEDIA,
      payload: [],
    });
  };
};

export const createRestaurantDish = (data, resID) => {
  return (dispatch) => {
    return axios
      .post(`/restaurants/${resID}/dishes`, data)
      .then((res) => {
        dispatch({
          type: CREATE_RESTAURANT_DISH,
          payload: { dish: res.data },
        });
        notify({ type: 'info', description: 'Created Restaurant Dish' });
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

export const deleteRestaurantDish = (resID, dishID) => {
  return (dispatch) => {
    return axios
      .delete(`/restaurants/${resID}/dishes/${dishID}`)
      .then((res) => {
        dispatch({
          type: DELETE_RESTAURANT_DISH,
          payload: dishID,
        });
        notify({ type: 'info', description: 'Deleted Restaurant Dish' });
      })
      .catch((err) => {
        notify({ type: 'error', description: JSON.stringify(err.response.data.message) });
      });
  };
};

export const createDishMedia = (data, dishID) => {
  return (dispatch) => {
    dispatch({
      type: CREATE_DISH_MEDIA,
      payload: { media: data, dishID },
    });
    notify({ type: 'info', description: 'Created Dish Media' });
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
