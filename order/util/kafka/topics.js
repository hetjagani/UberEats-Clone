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
        topic: 'cartitem.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'cartitem.update',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'cartitem.delete',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'cartitem.reset',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'order.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'order.place',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'order.updatestatus',
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
