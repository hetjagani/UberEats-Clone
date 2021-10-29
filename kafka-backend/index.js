require('./config');

const kafka = require('kafka-node');

const client = new kafka.KafkaClient({
  kafkaHost: global.gConfig.kafka_host,
});
const consumer = new kafka.Consumer(
  client,
  [
    { topic: 'restaurant.create', partitions: 1 },
    { topic: 'restaurant.update', partitions: 1 },
  ],
  {
    groupId: 'uber-eats',
  },
);

const producer = new kafka.Producer(client);

require('./consumers/restaurant')(producer, consumer);
