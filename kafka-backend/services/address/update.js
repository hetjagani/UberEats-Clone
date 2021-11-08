const { Types } = require('mongoose');
const { getCustomerConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { Address } = getCustomerConnection();

  const { address, id } = msg;

  Address.updateOne({ _id: Types.ObjectId(id) }, address)
    .then((data) => {
      callback(null, { _id: id });
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
