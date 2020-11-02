const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI;

let connection = null;

const getConnection = () => {
  if (!connection) {

    connection = new mongoose.Mongoose();
    connection.connect(connectionString, {
      // retry to connect for 60 times
      reconnectTries: 600,
      // wait 1 second before retrying
      reconnectInterval: 1000,
      useNewUrlParser: true,
    });

    if (process.env.NODE_ENV !== 'production') {
      connection.set('debug', (coll, method, query, doc, options) => {
        console.log('MongoDB ', { coll, method, query, doc, options });
      });
    }

    const mongoClient = connection.connection;

    mongoClient.on('error', err => {
      console.error('mongoDbError');
    });

    mongoClient.on('disconnected', () => {
      console.error('MongoDB disconnected.');
    });

    mongoClient.on('connecting', () => {
      console.debug('MongoDB connecting...');
    });

    mongoClient.on('connected', async () => {
      console.info('MongoDB connected.');
    });

    mongoClient.on('open', () => {
      console.debug('MongoDB connection open.');
    });
  }

  return connection;
};
exports.getConnection = getConnection;
