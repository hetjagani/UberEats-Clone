const mongoose = require('mongoose');

if (!global.gConfig.database_conn) {
  console.error('please provide database_conn in config file...');
}

const initDB = () => {
  mongoose.connect(global.gConfig.database_conn, { maxPoolSize: 50, minPoolSize: 5 });
  mongoose.set('debug', true);
};

module.exports = {
  initDB,
};
