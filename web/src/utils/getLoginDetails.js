import jwt from 'jsonwebtoken';

const getLoginDetails = () => {
  const [authToken] = document.cookie.split(';').filter((cookie) => {
    const parts = cookie.split('=');
    if (parts[0].trim() == 'auth') {
      return parts[1];
    }
  });

  if (authToken) {
    const token = authToken.split('=')[1];
    const tokendata = jwt.decode(token);
    return tokendata;
  } else {
    return null;
  }
};

export default getLoginDetails;
