const CognitoAuth = require('./cognito-auth');
const Utils = require('./utils');

module.exports.handler = async (event) => {
  const poolData = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_APP_CLIENT_ID,
  };

  const params = {
    clientId: event.queryStringParameters.clientId,
    clientSecret: event.queryStringParameters.clientSecret,
  };

  let data;
  try {
    data = await new CognitoAuth(poolData).accesstoken(params);
  } catch (err) {
    console.log(err);
    return Utils().resError(400, err.message);
  }
  return Utils().resSuccess(data);
};
