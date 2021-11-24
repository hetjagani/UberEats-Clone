const { default: axios } = require('axios');
const { GraphQLError } = require('graphql');

const { restaurant_url } = global.gConfig;
const restaurant = async (args, req) => {
  try {
    const { _id } = args;
    const { authorization } = req.headers;

    const response = await axios.get(`${restaurant_url}/restaurants/${_id}`, {
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

const restaurants = async (args, req) => {
  try {
    const { authorization } = req.headers;

    const response = await axios.get(`${restaurant_url}/restaurants`, {
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
  restaurant,
  restaurants,
};
