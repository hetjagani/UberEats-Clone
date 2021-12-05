const { default: axios } = require('axios');

const query = async (query, variables) => {
  const response = await axios.post('/query', { query, variables });

  return response.data?.data;
};

module.exports = query;
