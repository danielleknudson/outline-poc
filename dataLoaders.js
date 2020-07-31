const {groupBy, map} = require('rambda');
const DataLoader = require('dataloader');
const models = require('./models');

const risksByUserIds = async userIds => {
  const risks = await models.Risk.findAll({
    where: {
      creatorId: userIds,
    },
  });
  const groupedRisks = groupBy(risk => risk.creatorId, risks);
  return map(userId => groupedRisks[userId] || [], userIds);
};

const getRisksForUserDataLoader = () => {
  return new DataLoader(risksByUserIds);
};

const getCreators = async creatorIds => {
  const users = await models.User.findAll({where: {id: creatorIds}});
  const usersMap = {};
  users.forEach(user => (usersMap[user.id] = user));
  return creatorIds.map(id => usersMap[id]);
};

const getCreatorDataLoader = () => {
  return new DataLoader(getCreators);
};

module.exports = {
  getRisksForUserDataLoader,
  getCreatorDataLoader,
};
