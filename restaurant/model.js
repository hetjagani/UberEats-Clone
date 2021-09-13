const { DataTypes } = require('sequelize');

const Restaurant = global.DB.define('restaurants', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  contact_no: {
    type: DataTypes.STRING,
  },
  time_open: {
    type: DataTypes.TIME,
  },
  time_close: {
    type: DataTypes.TIME,
  },
  food_type: {
    type: DataTypes.ENUM('veg', 'non-veg', 'vegan'),
  },
  restaurant_type: {
    type: DataTypes.ENUM('delivery', 'pickup'),
  },
});

const Media = global.DB.define('media', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  url: {
    type: DataTypes.STRING,
  },
  alt_text: {
    type: DataTypes.STRING,
  },
});

const Dish = global.DB.define('dishes', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
  },
  food_type: {
    type: DataTypes.ENUM('veg', 'non-veg', 'vegan'),
  },
  category: {
    type: DataTypes.ENUM('appetizer', 'salad', 'main_course', 'dessert', 'beverage'),
  },
});

Restaurant.belongsToMany(Media, { through: 'restaurant_media' });
Media.belongsToMany(Restaurant, { through: 'restaurant_media' });

Restaurant.hasMany(Dish, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Dish.belongsTo(Restaurant);

Dish.belongsToMany(Media, { through: 'dish_media' });
Media.belongsToMany(Dish, { through: 'dish_media' });

const runMigration = async () => {
  if (!global.DB) {
    return Promise.reject(new Error('please initialize DB'));
  }
  global.DB.sync({ alter: true });
  return Promise.resolve(global.DB);
};

module.exports = {
  Restaurant,
  Media,
  Dish,
  runMigration,
};
