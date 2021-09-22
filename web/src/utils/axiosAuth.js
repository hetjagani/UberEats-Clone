import axios from 'axios';

function createAxiosAuthMiddleware() {
  return ({ getState }) =>
    (next) =>
    (action) => {
      const [authToken] = document.cookie.split(';').filter((cookie) => {
        const parts = cookie.split('=');
        if (parts[0].trim() == 'auth') {
          return parts[1];
        }
      });

      if (authToken) {
        const token = authToken.split('=')[1];
        axios.defaults.headers.common['Authorization'] = token;
      }
      axios.defaults.baseURL = window.BACKEND_API_URL;
      axios.defaults.withCredentials = false;
      return next(action);
    };
}


export default createAxiosAuthMiddleware;
