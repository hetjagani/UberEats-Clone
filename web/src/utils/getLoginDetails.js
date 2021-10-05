import jwt from 'jsonwebtoken';
import { getCookie } from 'react-use-cookie';

const getLoginDetails = () => {
  const token = getCookie('auth');
  if (token) {
    const tokendata = jwt.decode(token);
    return tokendata;
  } else {
    return {};
  }
};

export default getLoginDetails;
