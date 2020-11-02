const { PubSub, withFilter } = require('apollo-server-express');
const { userService, optionsService } = require('../services');

const pubsub = new PubSub();
const MESSAGE_CREATED = 'MESSAGE_CREATED';
const MESSAGE_UPDATED = 'MESSAGE_UPDATED';
const USER_VOTED = 'USER_VOTED';
const USER_CREATED = 'USER_CREATED';

const queries = {
  users: async (parent, args, context, info) => {
    const result = await userService.find(args);
    return result;
  },
  options: async (parent, args, context, info) => {
    const result = await optionsService.find(args);
    return result;
  },
  _dev_timestamp: (parent, args, context, info) => new Date(),
};

const mutations = {
  createUser: async (parent, {
    ip,
  }, context, info) => {
    const user = await userService.create({
      ip: ip || context.ip,
    });
    await pubsub.publish(USER_CREATED);
    return user;
  },
  createOption: async (parent, args, context, info) => {
    const user = await optionsService.create(args);
    return user;
  },
  vote: async (parent, args, context, info) => {
    const user = await optionsService.vote(args);
    await pubsub.publish(USER_VOTED);
    return user;
  },
  updateUser: async (parent, args, context, info) => {
    const user = await userService.update(args);
    return user;
  },
  _dev: async (parent, args, context, info) => {
    await pubsub.publish(MESSAGE_CREATED, { messageCreated: 'test mutation paylod' });
    return 'test mutation';
  },
  subscriptionWithFilter: async (parent, { filter }, context, info) => {
    await pubsub.publish(MESSAGE_UPDATED, { filter });
    return `test mutation with filter ${filter}`;
  },
};
const subscription = {
  _dev: {
    resolve: (payload) => payload.messageCreated,
    subscribe: () => pubsub.asyncIterator(MESSAGE_CREATED),
  },
  subscriptionWithFilter: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(MESSAGE_UPDATED),
      (payload, variables) => payload.filter === variables.filter,
    ),
  },
  liveResult: {
    resolve: async (payload) => {
      const result = await optionsService.find({});
      return result;
    },
    subscribe: () => pubsub.asyncIterator(USER_VOTED),
  },
  newUser: {
    resolve: async (payload) => {
      const result = await userService.find({ online: true });
      return result;
    },
    subscribe: () => pubsub.asyncIterator(USER_CREATED),
  },
};

const resolvers = {
  Query: queries,
  Mutation: mutations,
  Subscription: subscription,
};

module.exports = resolvers;
