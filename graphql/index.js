const { ApolloServer } = require('apollo-server-express');
const { mergeSchemas } = require('graphql-tools');

const appSchema = require('./schema');

const schemas = [];
schemas.push(appSchema);

const schema = mergeSchemas({ schemas });

const server = new ApolloServer({
  schema,
  context: (params) => {
    const { req, connection } = params;
    if (connection) {
      return connection.context;
    }
    return {
      ip: req.ip,
      user: req.user,
    };
  },
  formatError: (error) => {
    if (error.originalError && error.originalError.errors && error.originalError.errors.length) {
      let customError = error.originalError.errors[0];
      if (customError.originalError && customError.originalError.statusCode) {
        customError = customError.originalError;
        return ({ message: customError.message, ...customError });
      }
    }
    return error;
  },
  playground: true,
  introspection : true,
});

module.exports = server;
