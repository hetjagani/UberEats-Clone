const { Schema, Types, model } = require('mongoose');

const CartItemSchema = new Schema({
  customerId: Types.ObjectId,
  dishId: Types.ObjectId,
  restaurantId: Types.ObjectId,
  quantity: Number,
  notes: String,
});

const OrderItemSchema = new Schema({
  customerId: Types.ObjectId,
  dishId: Types.ObjectId,
  restaurantId: Types.ObjectId,
  quantity: Number,
  notes: String,
  price: Number,
});

const OrderSchema = new Schema({
  amount: Number,
  status: {
    type: String,
    enum: ['INIT', 'PLACED', 'PREPARING', 'PICKUP_READY', 'COMPLETE', 'CANCEL'],
  },
  date: Date,
  restaurantId: Types.ObjectId,
  customerId: Types.ObjectId,
  addressId: Types.ObjectId,
  type: {
    type: String,
    enum: ['delivery', 'pickup'],
  },
  orderitems: [OrderItemSchema],
  notes: String,
});

const Order = model('orders', OrderSchema);
const CartItem = model('cartitems', CartItemSchema);

module.exports = {
  Order,
  CartItem,
};
