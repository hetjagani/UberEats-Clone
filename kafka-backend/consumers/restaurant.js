/* eslint-disable no-case-declarations */
const { Types } = require('mongoose');
const { getRestaurantConnection } = require('../connections');
const { sendData } = require('../utils/kafka');

module.exports = (producer, consumer) => {
  const { Restaurant } = getRestaurantConnection();

  consumer.on('message', async (m) => {
    switch (m.topic) {
      case 'restaurant.create':
        try {
          const restaurant = JSON.parse(m.value);
          const createdRes = await Restaurant.create(restaurant);

          sendData(producer, createdRes, false);
        } catch (err) {
          console.error(err);
          sendData(producer, err, true);
        }
        break;

      case 'restaurant.update':
        try {
          const updateData = JSON.parse(m.value);
          console.log(updateData.id, updateData.restaurant);
          await Restaurant.updateOne({ _id: Types.ObjectId(updateData.id) }, updateData.restaurant);

          sendData(producer, { _id: updateData.id }, false);
        } catch (err) {
          console.error(err);
          sendData(producer, err, true);
        }
        break;

      default:
        break;
    }
  });
};
