const fs = require('fs');
const path = require('path');

const { makeExecutableSchema } = require('graphql-tools');

const resolversApp = require('./resolvers');

const typeDefsApp = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8');

const schema = makeExecutableSchema({
  typeDefs: typeDefsApp,
  resolvers: resolversApp,
});

module.exports = schema;
