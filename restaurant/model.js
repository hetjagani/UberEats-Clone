const { Schema, Types, model } = require('mongoose');

const MediaSchema = new Schema({
  url: String,
  alt_text: String,
});

const DishSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  food_type: {
    type: String,
    enum: ['veg', 'non-veg', 'vegan'],
  },
  category: {
    type: String,
    enum: ['appetizer', 'salad', 'main_course', 'dessert', 'beverage'],
  },
  restaurantId: Types.ObjectId,
  media: [MediaSchema],
});

const RestaurantSchema = new Schema({
  name: String,
  description: String,
  address: String,
  city: String,
  state: String,
  country: String,
  contact_no: String,
  time_open: String,
  time_close: String,
  food_type: {
    type: String,
    enum: ['veg', 'non-veg', 'vegan'],
  },
  restaurant_type: {
    type: String,
    enum: ['delivery', 'pickup'],
  },
  media: [MediaSchema],
  dishes: [Types.ObjectId],
});

const Restaurant = model('restaurants', RestaurantSchema);
const Dish = model('dishes', DishSchema);

module.exports = {
  Restaurant,
  Dish,
};
