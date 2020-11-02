const dotenv = require('dotenv');


try {
  dotenv.load();
} catch (e) {
  console.log('missing env file', e);
}

const setupExpress = require('./config/express');
const setupGraphQL = require('./config/graphql');
const mongoSetup = require('./config/mongo');

let app = setupExpress();
const port = app.get('port');
app = setupGraphQL(app);
mongoSetup();

app.listen(port, () => {
  console.info(`🚀 Express server listening on port ${port}`);
});
