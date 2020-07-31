const Sequelize = require('sequelize');

const sequelize = new Sequelize('outline', 'daniknudson', null, {
  // gimme postgres, please!
  dialect: 'postgres',
  logging: q => console.log(q, '\n'),
});

const CoverageTypeEnum = Sequelize.DataTypes.ENUM(
  'allRisk',
  'allRisk:earthquakeExclusion',
  'allRisk:earthquakeSprinklerLeakageExclusion',
  'allRisk:floodExclusion',
  'allRisk:windExclusion',
  'dic:earthquake',
  'dic:earthquakeSprinklerLeakage',
  'dic:flood',
  'dic:wind',
  'standalone:earthquake',
  'standalone:flood',
  'standalone:excessFlood',
  'standalone:wind',
  'dbb:hail',
  'dbb:wind',
  'builders',
  'monolineProperty',
  'cgl',
  'package',
  'mpl',
  'specialEvents',
  'riskCapdno',
  'microBOP'
);
const CoverageTypeArray = Sequelize.DataTypes.ARRAY(CoverageTypeEnum);

const models = {
  User: sequelize.define('users', {
    id: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    brokerSupport: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
    },
  }),
  Risk: sequelize.define('risks', {
    id: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    coveragesRequested: {
      type: CoverageTypeArray,
      defaultValue: [],
    },
  }),
  Group: sequelize.define('groups', {
    id: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }),
};

models.User.belongsToMany(models.Group, {through: 'users_groups'});
models.Risk.belongsTo(models.User, {as: 'creator'});
models.User.hasMany(models.Risk, {as: 'risks', foreignKey: 'creatorId'});

module.exports = models;
