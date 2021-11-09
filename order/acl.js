module.exports = {
  'GET /orders/all$': ['restaurant'],
  'GET /orders?(.+)': ['customer', 'restaurant'],
  'POST /orders?(.+)': ['customer'],
  'PUT /orders?(.+)': ['restaurant', 'customer'],
  'GET /cartitems': ['customer'],
  'POST /cartitems': ['customer'],
  'PUT /cartitems/?(.+)': ['customer'],
  'DELETE /cartitems/?(.+)': ['customer'],
};
