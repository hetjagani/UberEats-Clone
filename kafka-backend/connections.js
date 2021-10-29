const mongoose = require('mongoose');

const getAuthConnection = () => {
  const authConn = mongoose.createConnection(global.gConfig.auth_conn);
  authConn.set('debug', true);

  const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: {
      type: String,
      enum: ['customer', 'restaurant'],
    },
  });

  const User = authConn.model('users', UserSchema);

  return { authConn, User };
};

const getRestaurantConnection = () => {
  const restaurantConn = mongoose.createConnection(global.gConfig.restaurant_conn);
  mongoose.set('debug', true);

  const MediaSchema = new mongoose.Schema({
    url: String,
    alt_text: String,
  });

  const DishSchema = new mongoose.Schema({
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
    restaurantId: mongoose.Types.ObjectId,
    media: [MediaSchema],
  });

  const RestaurantSchema = new mongoose.Schema({
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
    dishes: [mongoose.Types.ObjectId],
  });

  const Restaurant = restaurantConn.model('restaurants', RestaurantSchema);
  const Dish = restaurantConn.model('dishes', DishSchema);

  return { restaurantConn, Restaurant, Dish };
};

module.exports = {
  getAuthConnection,
  getRestaurantConnection,
};
