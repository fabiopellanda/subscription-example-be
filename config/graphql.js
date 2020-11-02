const http = require('http');
const { express: voyagerMiddleware } = require('graphql-voyager/middleware');

const server = require('../graphql');

const registerGraphql = app => {
  server.applyMiddleware({ app, cors: true });

  app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);
  return httpServer;
};

module.exports = registerGraphql;
