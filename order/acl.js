module.exports = {
  'GET /orders?(.+)': ['customer', 'restaurant'],
  'POST /orders?(.+)': ['customer'],
  'PUT /orders?(.+)': ['restaurant'],
  'GET /cartitems': ['customer'],
  'POST /cartitems': ['customer'],
  'DELETE /cartitems/?(.+)': ['customer'],
};
