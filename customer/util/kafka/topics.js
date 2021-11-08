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
        topic: 'customer.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'customer.update',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'customer.delete',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'address.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'address.update',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'address.delete',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'favourite.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'favourite.delete',
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
