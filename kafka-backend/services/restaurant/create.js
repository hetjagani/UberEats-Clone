const { getRestaurantConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { Restaurant } = getRestaurantConnection();

  Restaurant.create(msg)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
