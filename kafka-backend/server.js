require('./config');
var connection = new require('./kafka/connection');
var createRestaurant = require('./services/restaurant/create');
var updateRestaurant = require('./services/restaurant/update');
var deleteRestaurant = require('./services/restaurant/delete');
var createDish = require('./services/dish/create');
var updateDish = require('./services/dish/update');
var deleteDish = require('./services/dish/delete');

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
