const { User, Option, helper } = require('../models');

const find = async (args) => {
  const result = await helper.find({
    Model: Option,
    args
  });
  return result;
};

const create = async (args) => {
  const result = await helper.create({
    Model: Option,
    args,
  });
  return result;
};

const vote = async ({
  optionId,
  userId,
}) => {
  const optionUpdated = await helper.update({
    Model: Option,
    args: { id: optionId },
    extraData: (entity) => {
      entity.count ++;
      return entity;
    },
  });
  await helper.update({
    Model: User,
    args: {
      id: userId,
      extraData: (entity) => {
        entity.votes.push(
          {
            optionId,
            createdAt: new Date(),
          }
        )
        return entity;
      },
    },
  });
  return optionUpdated;
};


exports.vote = vote;
exports.find = find;
exports.create = create;
