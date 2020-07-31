const {SchemaDirectiveVisitor} = require('apollo-server');
const {defaultFieldResolver} = require('graphql');
class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const originalResolve = field.resolve || defaultFieldResolver;

    field.resolve = function (...args) {
      const context = args[2];
      if (!context.viewer) {
        throw new Error('You must be logged in to see that.');
      }

      return originalResolve.apply(this, args);
    };
  }
}

class RiskOwnerDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const originalResolve = field.resolve || defaultFieldResolver;

    field.resolve = async function (source, args, context, info) {
      const {
        variableValues: {riskId},
      } = info;
      const risk = await context.models.Risk.findById(riskId);

      if (risk.creatorId !== context.viewer.id) {
        throw new Error("You don't have permission to view this submission.");
      }

      return originalResolve.apply(this, [source, args, context, info]);
    };
  }
}

class BrokerSupportDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const originalResolve = field.resolve || defaultFieldResolver;

    field.resolve = function (...args) {
      const context = args[2];
      if (!context.viewer.brokerSupport) {
        throw new Error(
          'You do not have the permissions to view these resources.'
        );
      }

      return originalResolve.apply(this, args);
    };
  }
}

module.exports = {
  BrokerSupportDirective,
  RiskOwnerDirective,
  AuthDirective,
};
