const kafka = require('kafka-node');

const createKafkaTopics = () => {
  const client = new kafka.KafkaClient({
    kafkaHost: global.gConfig.kafka_host,
  });
  const admin = new kafka.Admin(client);
  admin.createTopics(
    [
      {
        topic: 'response_topic',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'restaurant.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'restaurant.update',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'restaurant.delete',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'dish.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'dish.update',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'dish.delete',
        partitions: 1,
        replicationFactor: 1,
      },
    ],
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );
};

module.exports = {
  createKafkaTopics,
};
