const { Types } = require('mongoose');
const { getCustomerConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { Address, Customer } = getCustomerConnection();

  Address.deleteOne({ _id: Types.ObjectId(msg.id) })
    .then((data) => {
      return Customer.updateOne(
        { _id: Types.ObjectId(msg.customerId) },
        { $pull: { addresses: Types.ObjectId(msg.id) } },
      );
    })
    .then((data) => {
      callback(null, { success: true });
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
