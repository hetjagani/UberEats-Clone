const { Types } = require('mongoose');
const { getOrderConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { CartItem } = getOrderConnection();

  CartItem.deleteMany({ customerId: Types.ObjectId(msg.customerId) })
    .then((data) => {
      callback(null, { success: true });
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
