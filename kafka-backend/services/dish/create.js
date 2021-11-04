const { getRestaurantConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { Dish } = getRestaurantConnection();

  Dish.create(msg)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
