const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const setupExpress = () => {
  const app = express();

  app.enable('trust proxy'); // manage x-forwarded-for header
  app.set('port', process.env.PORT || 3010);
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.text());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  return app;
};

module.exports = setupExpress;
