const { default: axios } = require('axios');
const { GraphQLError } = require('graphql');

const { customer_url } = global.gConfig;
const addresses = async (args, req) => {
  try {
    const { authorization } = req.headers;

    const response = await axios.get(`${customer_url}/customers/addresses`, {
      headers: { Authorization: authorization },
    });

    return response.data;
  } catch {
    console.log(err);
    if (err.isAxiosError) {
      return new GraphQLError(err.response?.message);
    }
    return new GraphQLError(err);
  }
};

const address = async (args, req) => {
  try {
    const { authorization } = req.headers;
    const { _id } = args;

    const response = await axios.get(`${customer_url}/customers/addresses/${_id}`, {
      headers: { Authorization: authorization },
    });

    return response.data;
  } catch {
    console.log(err);
    if (err.isAxiosError) {
      return new GraphQLError(err.response?.message);
    }
    return new GraphQLError(err);
  }
};

module.exports = {
  addresses,
  address,
};
