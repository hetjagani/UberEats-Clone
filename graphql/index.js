require('./config');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const { buildSchema } = require('graphql');
const app = express();
const fs = require('fs');
const { getAuthMiddleware } = require('u-server-utils');
const validate = require('./authValidator');
const { restaurant, restaurants } = require('./resolvers/restaurant');
const { dish, dishes } = require('./resolvers/dish');
const { customer, createCustomer } = require('./resolvers/customer');
const { favourites } = require('./resolvers/favourite');
const { addresses, address } = require('./resolvers/address');
const { orders, order, initOrder, placeOrder } = require('./resolvers/order');
const { cartitems } = require('./resolvers/cartitems');

const gqlSchema = fs.readFileSync('./schema/schema.graphql');

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Max-Age', 1728000);
  next();
});

let schema = buildSchema(gqlSchema.toString());

const root = {
  restaurant,
  restaurants,
  dish,
  dishes,
  customer,
  favourites,
  addresses,
  address,
  orders,
  order,
  cartitems,
  initOrder,
  placeOrder,
  createCustomer,
};

app.use(
  '/query',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
);

app.use(getAuthMiddleware(validate));

app.listen(3001, () => {
  console.log('GraphQL server started on port 3001');
});
