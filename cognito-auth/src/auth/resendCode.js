/* eslint no-console: ["error", { allow: ["log", "error"] }] */
/* eslint max-len: ["error", 120] */
const CognitoAuth = require('./cognito-auth');
const Utils = require('./utils');

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  const poolData = {
    UserPoolId: process.env.USER_POOL_ID,
    ClientId: process.env.APP_CLIENT_ID,
  };

  const params = {
    clientId: body.clientId,
  };

  let data;
  try {
    data = await new CognitoAuth(poolData).signupResend(params);
  } catch (err) {
    console.log(err);
    return Utils().resError(400, err.message);
  }
  return Utils().resSuccess(data);
};
