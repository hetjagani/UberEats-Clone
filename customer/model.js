const { Schema, Types, model } = require('mongoose');

const MediaSchema = new Schema({
  url: String,
  alt_text: String,
});

const CustomerSchema = new Schema({
  name: String,
  nickname: String,
  about: String,
  city: String,
  state: String,
  country: String,
  contact_no: String,
  medium: MediaSchema,
  favourites: [Types.ObjectId],
  addresses: [Types.ObjectId],
});

const AddressSchema = new Schema({
  firstLine: String,
  secondLine: String,
  zipcode: String,
  city: String,
  state: String,
  country: String,
  customerId: Types.ObjectId,
});

const Customer = model('customers', CustomerSchema);
const Address = model('addresses', AddressSchema);

module.exports = {
  Customer,
  Address,
};
