const { Types } = require('mongoose');
const { getCustomerConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { Customer } = getCustomerConnection();

  Customer.deleteOne({ _id: Types.ObjectId(msg.id) })
    .then((data) => {
      callback(null, { success: true });
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
