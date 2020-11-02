const { getConnection } = require('../models/connection');

const mongooseSetup = function mongooseSetup() {
  getConnection();
};

module.exports = mongooseSetup;
