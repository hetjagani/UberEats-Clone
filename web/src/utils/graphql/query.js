import axios from 'axios';
import { getCookie } from 'react-use-cookie';

const query = async (query, variables) => {
  const token = getCookie('auth');
  const response = await axios.post(
    'http://localhost:3001/query',
    { query, variables },
    {
      headers: { Authorization: token },
    },
  );

  return response.data?.data;
};

export default query;
