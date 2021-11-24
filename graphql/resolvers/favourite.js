const { default: axios } = require('axios');
const { GraphQLError } = require('graphql');

const { customer_url } = global.gConfig;
const favourites = async (args, req) => {
  try {
    const { authorization } = req.headers;

    const response = await axios.get(`${customer_url}/customers/favourites`, {
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
  favourites,
};
