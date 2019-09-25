/* eslint no-console: ["error", { allow: ["log", "error"] }] */
/* eslint max-len: ["error", 120] */
const CognitoAuth = require('./cognito-auth');
const Utils = require('./utils');

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  console.log(body);

  const poolData = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_APP_CLIENT_ID,
  };

  const params = {
    clientId: body.clientId,
    clientSecret: body.clientSecret,
  };

  let data;
  try {
    data = await new CognitoAuth(poolData).deleteUser(params);
  } catch (err) {
    console.log(err);
    return Utils().resError(400, err.message);
  }
  return Utils().resSuccess(data);
};
