const { User, helper } = require('../models');

const find = async (args) => {
  const result = await helper.find({
    Model: User,
    args
  });
  return result;
};

const create = async (args) => {
  const result = await helper.create({
    Model: User,
    args,
  });
  return result;
};

const update = async (args) => {
  const userUpdated = await helper.update({
    Model: User,
    args,
  });
  return userUpdated;
};

exports.find = find;
exports.create = create;
exports.update = update;
