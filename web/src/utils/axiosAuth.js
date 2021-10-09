import axios from 'axios';
import { getCookie, setCookie } from 'react-use-cookie';
import notify from './notify';

function createAxiosAuthMiddleware() {
  return ({ getState }) =>
    (next) =>
    (action) => {
      const authToken = getCookie('auth');

      if (authToken) {
        axios.defaults.headers.common['Authorization'] = authToken;
      }

      axios.defaults.baseURL = window.BACKEND_API_URL;
      axios.defaults.withCredentials = false;
      axios.interceptors.response.use(
        (res) => res,
        (err) => {
          if (err.response.status === 401) {
            setCookie('auth', null);
            window.location = '/auth/login';
            notify({ type: 'error', description: 'Unauthorized. Please Login.' });
          }
          return Promise.reject(err);
        },
      );
      return next(action);
    };
}

export default createAxiosAuthMiddleware;
