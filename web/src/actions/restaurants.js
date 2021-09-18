import axios from 'axios';
import { notifyError, notifyInfo } from './notify';
import { CREATE_RESTAURANT } from './types';

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
