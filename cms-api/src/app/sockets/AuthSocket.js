const jwt = require('jsonwebtoken');
const { Operation } = require('../../infra/core/core');

class AuthSocket extends Operation {
  constructor({ UserRepository }) {
    super();
    this.UserRepository = UserRepository;
  }

  async execute(event, context) {
    try {
      const { methodArn, queryStringParameters } = event;
      const { Authorizer } = queryStringParameters;
      console.log('Websocket Authorizer:', Authorizer);

      if (!Authorizer) {
        return context.fail('Unauthorized websocket request.');
      }

      // validate auth token
      const email = this.getEmailFromToken(Authorizer);
      const user = await this.UserRepository.getByEmail(email);
      console.log('Authorizer email:', email);

      if (!email || !user) {
        return context.fail('Unauthorized websocket request.');
      }

      console.log('Websocket user:', user.toJSON());
      context.succeed(this.generateAllow('me', methodArn));
    } catch (err) {
      console.log('Websocket auth error:', err);
      context.fail('Unauthorized websocket request.');
    }
  }

  getEmailFromToken(token) {
    const auth = jwt.decode(token);
    if (!auth) return false;

    const { identities } = auth;

    // get user from auth header token
    if (identities.length > 0) {
      const identity = identities[0];
      const { userId } = identity;

      if (!userId) return null;
      return userId;
    }
  }

  // Help function to generate an IAM policy
  generatePolicy(principalId, effect, resource) {
    // Required output:
    const authResponse = {};
    authResponse.principalId = principalId;

    if (effect && resource) {
      const policyDocument = {};
      policyDocument.Version = '2012-10-17'; // default version
      policyDocument.Statement = [];

      const statementOne = {};
      statementOne.Action = 'execute-api:Invoke'; // default action
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
    }

    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
      stringKey: 'stringval',
      numberKey: 123,
      booleanKey: true,
    };

    return authResponse;
  }

  generateAllow(principalId, resource) {
    return this.generatePolicy(principalId, 'Allow', resource);
  }

  generateDeny(principalId, resource) {
    return this.generatePolicy(principalId, 'Deny', resource);
  }
}
module.exports = AuthSocket;
