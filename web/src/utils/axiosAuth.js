import axios from 'axios';

function createAxiosAuthMiddleware() {
  return ({ getState }) =>
    (next) =>
    (action) => {
      const authToken = document.cookie.split(';').filter((cookie) => {
        const parts = cookie.split('=');
        if (parts[0].trim() == 'auth') {
          return parts[1];
        }
      });

      if (authToken) {
        axios.defaults.headers.common['Authorization'] = authToken;
      }
      axios.defaults.baseURL = window.BACKEND_API_URL;
      axios.defaults.withCredentials = true;
      return next(action);
    };
}

const axiosAuth = createAxiosAuthMiddleware();

export default axiosAuth;
