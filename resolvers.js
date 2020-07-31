const models = require('./models');

module.exports = {
  Query: {
    me: async (_, __, context) => {
      return await context.models.User.findById(context.viewer.id);
    },
    user: async (_, {userId}, context) => {
      return await context.models.User.findById(userId);
    },
    users: async (_, __, context) => {
      return await context.models.User.findAll();
    },
    risk: async (_, {riskId}, context) => {
      return await context.models.Risk.findById(riskId);
    },
    risks: async (_, __, context) => {
      if (context.viewer.brokerSupport) {
        return await context.models.Risk.findAll();
      }
      return await models.Risk.findAll({
        where: {
          creatorId: context.viewer.id,
        },
      });
    },
  },
  User: {
    id: user => {
      return user.id;
    },
    name: user => {
      return user.name;
    },
    groups: user => {
      return user.getGroups();
    },
    risks: async (user, __, {loaders}) => {
      return loaders.risksFromUsers.load(user.id);
    },
  },
  Risk: {
    id: risk => {
      return risk.id;
    },
    coveragesRequested: risk => {
      return risk.coveragesRequested;
    },
    creator: async (risk, __, {loaders}) => {
      return await loaders.creators.load(risk.creatorId);
    },
  },
};
