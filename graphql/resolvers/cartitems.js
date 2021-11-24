const { default: axios } = require('axios');
const { GraphQLError } = require('graphql');

const { order_url } = global.gConfig;
const cartitems = async (args, req) => {
  try {
    const { authorization } = req.headers;

    const response = await axios.get(`${order_url}/cartitems`, {
      headers: { Authorization: authorization },
      params: args,
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
  cartitems,
};
