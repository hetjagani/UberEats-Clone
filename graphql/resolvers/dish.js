const { default: axios } = require('axios');
const { GraphQLError } = require('graphql');

const { restaurant_url } = global.gConfig;
const dish = async (args, req) => {
  try {
    const { _id, restaurantId } = args;
    const { authorization } = req.headers;

    const response = await axios.get(
      `${restaurant_url}/restaurants/${restaurantId}/dishes/${_id}`,
      {
        headers: { Authorization: authorization },
      },
    );

    return response.data;
  } catch {
    console.log(err);
    if (err.isAxiosError) {
      return new GraphQLError(err.response?.message);
    }
    return new GraphQLError(err);
  }
};

const dishes = async (args, req) => {
  try {
    const { authorization } = req.headers;
    const { restaurantId } = args;

    const response = await axios.get(`${restaurant_url}/restaurants/${restaurantId}/dishes`, {
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
  dish,
  dishes,
};
