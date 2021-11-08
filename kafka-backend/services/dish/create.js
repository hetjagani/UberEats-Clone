const { Types } = require('mongoose');
const { getRestaurantConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { Dish, Restaurant } = getRestaurantConnection();

  let createdId = '';
  Dish.create(msg)
    .then((data) => {
      createdId = data._id;
      return Restaurant.updateOne(
        { _id: Types.ObjectId(data.restaurantId) },
        { $push: { dishes: Types.ObjectId(data._id) } },
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
