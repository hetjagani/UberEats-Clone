const { getOrderConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { CartItem } = getOrderConnection();

  CartItem.create(msg)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
