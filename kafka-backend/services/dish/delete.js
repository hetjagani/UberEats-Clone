const { Types } = require('mongoose');
const { getRestaurantConnection } = require('../../dbconnections');

const handle_request = (msg, callback) => {
  const { Restaurant, Dish } = getRestaurantConnection();

  Dish.deleteOne({ _id: Types.ObjectId(msg.id) })
    .then(() => {
      return Restaurant.updateOne(
        { _id: Types.ObjectId(msg.restaurantId) },
        { $pull: { dishes: Types.ObjectId(msg.id) } },
      );
    })
    .then(() => {
      callback(null, { success: true });
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports = handle_request;
