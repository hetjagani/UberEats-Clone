import axios from 'axios';
import { notifyError, notifyInfo } from './notify';
import { CREATE_RESTAURANT, CREATE_RESTAURANT_MEDIA } from './types';

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
