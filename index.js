const {ApolloServer, gql} = require('apollo-server');
const models = require('./models');
const {
  getRisksForUserDataLoader,
  getCreatorDataLoader,
} = require('./dataLoaders');
const resolvers = require('./resolvers');
const {
  BrokerSupportDirective,
  RiskOwnerDirective,
  AuthDirective,
} = require('./directives');

// 2. GRAPHQL - DEFINE GRAPHQL SCHEMA TYPES, QUERIES, DIRECTIVES
const typeDefs = gql`
  directive @isAuthenticated on QUERY | FIELD_DEFINITION
  directive @isRiskOwner on QUERY | FIELD_DEFINITION
  directive @isBrokerSupport on QUERY | FIELD_DEFINITION

  type Group {
    id: ID!
    name: String
  }

  type User {
    id: ID!
    name: String
    groups: [Group]!
    risks: [Risk]! @isAuthenticated
  }

  type Risk {
    id: ID!
    creator: User!
    coveragesRequested: [String]
  }

  type Query {
    me: User
    user(userId: ID!): User
    users: [User]!

    risk(riskId: ID!): Risk @isAuthenticated @isRiskOwner
    risks: [Risk]! @isAuthenticated @isBrokerSupport
  }
`;

// You can pass a userId at the start of the script to have a user "logged in"
// E.g., locally my super broker account is: db64259a-b500-42e3-bb71-c66646f7c7f9
// USER=db64259a-b500-42e3-bb71-c66646f7c7f9 node --inspect index.js
// I also recommend making sure your support broker account has brokerSupport = true
// so that you can see all risks
const USER = process.env.USER || '';

const server = new ApolloServer({
  cors: {
    origin: '*',
    credentials: true,
  },
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuthenticated: AuthDirective,
    isRiskOwner: RiskOwnerDirective,
    isBrokerSupport: BrokerSupportDirective,
  },
  context: async () => {
    return {
      // Add super+broker@outlinerisk.com to the context so that it can be used in directive resolvers
      viewer: await models.User.findById(USER),
      models: models,
      loaders: {
        risksFromUsers: getRisksForUserDataLoader(),
        creators: getCreatorDataLoader(),
      },
    };
  },
});

// The `listen` method launches a web server.
server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
