const { Types } = require('mongoose');
const { getOrderConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { CartItem } = getOrderConnection();

  CartItem.deleteOne({ _id: Types.ObjectId(msg.id) })
    .then((data) => {
      callback(null, { success: true });
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
