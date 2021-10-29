const sendData = (producer, data, isError) => {
  producer.send(
    [{ topic: 'response', messages: JSON.stringify({ data, isError }), partitions: 1 }],
    (err, d) => {
      if (err) {
        console.error(err);
        throw Error('error sending data to kafka');
      } else {
        console.log('SENT DATA:', d);
      }
    },
  );
};

module.exports = {
  sendData,
};
