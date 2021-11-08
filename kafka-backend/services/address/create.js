const { Types } = require('mongoose');
const { getCustomerConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { Customer, Address } = getCustomerConnection();

  const { address, customerId } = msg;

  let createdId = '';
  Address.create(address)
    .then((data) => {
      createdId = data._id;
      return Customer.updateOne(
        { _id: Types.ObjectId(customerId) },
        { $push: { address: data._id } },
      );
    })
    .then((data) => {
      callback(null, { _id: createdId });
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
