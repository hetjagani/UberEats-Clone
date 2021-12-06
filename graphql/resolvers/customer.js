const { default: axios } = require('axios');
const { GraphQLError } = require('graphql');

const { customer_url } = global.gConfig;
const customer = async (args, req) => {
  try {
    const { _id } = args;
    const { authorization } = req.headers;

    const response = await axios.get(`${customer_url}/customers/${_id}`, {
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

const createCustomer = async (args, req) => {
  try {
    const customerData = args.customer;
    const created = await axios.post(`${global.gConfig.customer_url}/customers`, customerData, {
      headers: { Authorization: req.headers.authorization },
    });
    return created.data
  } catch {
    console.log(err);
    if (err.isAxiosError) {
      return new GraphQLError(err.response?.message);
    }
    return new GraphQLError(err);
  }
};

module.exports = {
  customer,
  createCustomer,
};
