global.fetch = require('node-fetch'); // needed when deployed to aws
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const Crypto = require('crypto');

/**
 *
 * This library is a wrapper around the javascript frontend library aws-cognito-identity-js
 * to easily manage your Cognito User Pool in a node.js backend environment.
 */
class CognitoAuth {
  constructor(poolData) {
    this.poolData = poolData;
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  }

  /**
   * Register a user, specific for granting access to API
   * Generates a password (as clientSecret) on behalf of the user
   * Returns a custom clientId(username) and clientSecret(password)
   * @param {*} body
   */
  register(body) {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);

    const { username, attributes } = body;
    // Generates a custom password to be used as clientSecret
    const rand = Math.random().toString(36).substring(10);
    const password = rand + '/' + Crypto.createHash('SHA256').update(new Date().getTime() + username).digest('base64');

    const attributesList = [];

    if (attributes) {
      attributes.forEach((item) => {
        const attribute = new AmazonCognitoIdentity.CognitoUserAttribute(item);
        attributesList.push(attribute);
      });
    }

    return new Promise((resolve, reject) => {
      userPool.signUp(this.guid(username), password, attributesList, null, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const response = {
            clientId: result.user.username,
            clientSecret: password,
          };
          resolve(response);
        }
      });
    });
  }

  /**
   * Login an existing and confirmed user
   * Also, can be used to generate accesstoken and refreshtoken
   * @param {*} body
   */
  accesstoken(body) {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);

    const { clientId, clientSecret } = body;

    const authenticationData = {
      Username: clientId,
      Password: clientSecret,
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    const userData = {
      Username: clientId,
      Pool: userPool,
    };


    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess(res) {
          const data = {
            // refreshToken: res.getRefreshToken().getToken(),
            accessToken: res.getIdToken().getJwtToken(), // res.getAccessToken().getJwtToken(),
            accessTokenExpiresAt: res.getAccessToken().getExpiration(), // res.getAccessToken().getExpiration(),
            // idToken: res.getIdToken().getJwtToken(),
            // idTokenExpiresAt: res.getAccessToken().getExpiration(),
          };
          resolve(data);
        },
        onFailure(err) {
          reject(err);
        },
      });
    });
  }

  /**
   * Depending on your settings, email confirmation may be required
   * @param {*} body
   */
  signupConfirm(body) {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);

    const { clientId, confirmationCode } = body;

    const userData = {
      Username: clientId,
      Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(confirmationCode, true, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }

  /**
   * f the user didn't receive the signup confirmation code, they may request a new code
   * @param {*} body
   */
  signupResend(body) {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);

    const { clientId } = body;

    const userData = {
      Username: clientId,
      Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => cognitoUser.resendConfirmationCode((err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    }));
  }

  /**
   * Generate new refreshToken and accessToken with a new expiry date.
   * @param {*} body
   */
  refreshToken(body) {
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);

    const { clientId } = body;
    const refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: body.refreshToken });

    const userData = {
      Username: clientId,
      Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(refreshToken, (err, res) => {
        if (err) {
          reject(err);
        }

        const data = {
          refreshToken: res.getRefreshToken().getToken(),
          accessToken: res.getAccessToken().getJwtToken(),
          accessTokenExpiresAt: res.getAccessToken().getExpiration(),
        };
        resolve(data);
      });
    });
  }

  /**
   * Delete user identity from Cognito
   * @param {*} body
   */
  deleteUser(body) {
    const { clientId, clientSecret } = body;
    const authenticationData = {
      Username: clientId,
      Password: clientSecret,
    };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    const cognitoUser = this.cognitoUser(clientId);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess() {
          cognitoUser.deleteUser(function (err, res) {
            if (err) {
              reject(err);
            }
            resolve(res);
          });
        },
        onFailure(err) {
          reject(err);
        }
      });
    });
  }
  
  cognitoUser(username) {
    const userData = {
      Username: username,
      Pool: this.userPool,
    };
    return new AmazonCognitoIdentity.CognitoUser(userData);
  }

  insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
  }

  guid(str) {
    let hash = Crypto.createHash('sha256').update(str.toString()).digest('hex').substring(0, 36);
    const chars = hash.split('');
    chars[8] = '-';
    chars[13] = '-';
    chars[14] = '4';
    chars[18] = '-';
    chars[19] = '8';
    chars[23] = '-';
    hash = chars.join('');
    return hash;
  }
}

module.exports = CognitoAuth;
