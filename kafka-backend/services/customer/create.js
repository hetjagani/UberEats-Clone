const { getCustomerConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { Customer } = getCustomerConnection();

  Customer.create(msg)
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
