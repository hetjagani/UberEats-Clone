const { default: axios } = require('axios');
const { GraphQLError } = require('graphql');

const { order_url } = global.gConfig;
const orders = async (args, req) => {
  try {
    const { authorization } = req.headers;

    const response = await axios.get(`${order_url}/orders`, {
      headers: { Authorization: authorization },
      params: args,
    });

    return response.data;
  } catch (err) {
    console.log(err);
    if (err.isAxiosError) {
      return new GraphQLError(err.response?.message);
    }
    return new GraphQLError(err);
  }
};

const order = async (args, req) => {
  try {
    const { authorization } = req.headers;
    const { _id } = args;

    const response = await axios.get(`${order_url}/orders/${_id}`, {
      headers: { Authorization: authorization },
    });

    return response.data;
  } catch (err) {
    console.log(err);
    if (err.isAxiosError) {
      return new GraphQLError(err.response?.message);
    }
    return new GraphQLError(err);
  }
};

const initOrder = async (args, req) => {
  try {
    const response = await axios.post(
      `${global.gConfig.order_url}/orders/${args.type}`,
      {},
      {
        headers: { Authorization: req.headers.authorization },
      },
    );

    return response.data;
  } catch (err) {
    console.log(err);
    if (err.isAxiosError) {
      return new GraphQLError(err.response?.message);
    }
    return new GraphQLError(err);
  }
};

const placeOrder = async (args, req) => {
  try {
    const sendBody = args.order;

    const response = await axios.post(`${global.gConfig.order_url}/orders/place`, sendBody, {
      headers: { Authorization: req.headers.authorization },
    });

    return response.data;
  } catch (err) {
    console.log(err);
    if (err.isAxiosError) {
      return new GraphQLError(err.response?.message);
    }
    return new GraphQLError(err);
  }
};

module.exports = {
  orders,
  order,
  initOrder,
  placeOrder,
};
