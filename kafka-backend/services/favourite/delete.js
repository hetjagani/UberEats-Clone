const { Types } = require('mongoose');
const { getCustomerConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { Customer } = getCustomerConnection();

  Customer.updateOne(
    { _id: Types.ObjectId(msg.customerId) },
    { $pull: { favourites: Types.ObjectId(msg.restaurantId) } },
  )
    .then((data) => {
      callback(null, { success: true });
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
