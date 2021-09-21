import axios from 'axios';
import { notifyError, notifyInfo } from './notify';
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
        dispatch(notifyError(JSON.stringify(err.response.data.message), err.response.status));
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
        dispatch(notifyInfo('Created Restaurant'));
      })
      .catch((err) => {
        dispatch(notifyError(JSON.stringify(err.response.data.message), err.response.status));
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
        dispatch(notifyInfo('Created Restaurant Media'));
      })
      .catch((err) => {
        dispatch(notifyError(JSON.stringify(err.response.data.message), err.response.status));
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
        dispatch(notifyInfo('Updated Restaurant Dish'));
      })
      .catch((err) => {
        console.log(err);
        dispatch(notifyError(JSON.stringify(err.response.data.message), err.response.status));
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
        dispatch(notifyInfo('Created Dish Media'));
      })
      .catch((err) => {
        dispatch(notifyError(JSON.stringify(err.response.data.message), err.response.status));
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
