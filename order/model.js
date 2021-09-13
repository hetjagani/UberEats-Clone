const { DataTypes } = require('sequelize');

const CartItem = global.DB.define('cartitems', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dishId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
});

const Order = global.DB.define('orders', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.FLOAT,
  },
  status: {
    type: DataTypes.ENUM('INIT', 'PLACED', 'PREPARING', 'PICKUP_READY', 'COMPLETE', 'CANCEL'),
  },
  date: {
    type: DataTypes.DATE,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
  },
  customerId: {
    type: DataTypes.INTEGER,
  },
  addressId: {
    type: DataTypes.INTEGER,
  },
  type: {
    type: DataTypes.ENUM('delivery', 'pickup'),
  },
  notes: {
    type: DataTypes.STRING,
  },
});

const OrderItem = global.DB.define('orderitems', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  dishId: {
    type: DataTypes.INTEGER,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
});

Order.hasMany(OrderItem, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
OrderItem.belongsTo(Order);

const runMigration = async () => {
  if (!global.DB) {
    return Promise.reject(new Error('please initialize DB'));
  }
  await global.DB.sync({ alter: true });

  return Promise.resolve(global.DB);
};

module.exports = {
  Order,
  CartItem,
  OrderItem,
  runMigration,
};
