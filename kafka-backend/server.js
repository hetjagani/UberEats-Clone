require('./config');
var connection = new require('./kafka/connection');
var createRestaurant = require('./services/restaurant/create');
var updateRestaurant = require('./services/restaurant/update');
var deleteRestaurant = require('./services/restaurant/delete');
var createDish = require('./services/dish/create');
var updateDish = require('./services/dish/update');
var deleteDish = require('./services/dish/delete');
var createCustomer = require('./services/customer/create');
var updateCustomer = require('./services/customer/update');
var deleteCustomer = require('./services/customer/delete');
var createAddress = require('./services/address/create');
var updateAddress = require('./services/address/update');
var deleteAddress = require('./services/address/delete');
var createFavourite = require('./services/favourite/create');
var deleteFavourite = require('./services/favourite/delete');
var createCartitem = require('./services/cartitem/create');
var updateCartitem = require('./services/cartitem/update');
var deleteCartitem = require('./services/cartitem/delete');
var resetCartitem = require('./services/cartitem/reset');
var createOrder = require('./services/order/create');
var placeOrder = require('./services/order/place');
var updateOrderStatus = require('./services/order/updatestatus');

function handleTopicRequest(topic_name, fname) {
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log('server is running ');
  consumer.on('message', (message) => {
    console.log('MESSAGE RECEIVED FOR ' + topic_name);
    console.log(message.value);
    try {
      var data = JSON.parse(message.value);

      fname(data.data, (err, res) => {
        var payloads = [
          {
            topic: 'response_topic',
            messages: JSON.stringify({
              correlationId: data.correlationId,
              data: res,
            }),
            partition: 0,
          },
        ];
        producer.send(payloads, function (err, data) {
          console.log('SENT DATA FROM KAFKA BACKEND: ', JSON.stringify(res));
        });
        return;
      });
    } catch (e) {
      console.error(e);
    }
  });
}

// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest('restaurant.create', createRestaurant);
handleTopicRequest('restaurant.update', updateRestaurant);
handleTopicRequest('restaurant.delete', deleteRestaurant);
handleTopicRequest('dish.create', createDish);
handleTopicRequest('dish.update', updateDish);
handleTopicRequest('dish.delete', deleteDish);
handleTopicRequest('customer.create', createCustomer);
handleTopicRequest('customer.update', updateCustomer);
handleTopicRequest('customer.delete', deleteCustomer);
handleTopicRequest('address.create', createAddress);
handleTopicRequest('address.update', updateAddress);
handleTopicRequest('address.delete', deleteAddress);
handleTopicRequest('favourite.create', createFavourite);
handleTopicRequest('favourite.delete', deleteFavourite);
handleTopicRequest('cartitem.create', createCartitem);
handleTopicRequest('cartitem.update', updateCartitem);
handleTopicRequest('cartitem.delete', deleteCartitem);
handleTopicRequest('cartitem.reset', resetCartitem);
handleTopicRequest('order.create', createOrder);
handleTopicRequest('order.place', placeOrder);
handleTopicRequest('order.updatestatus', updateOrderStatus);
