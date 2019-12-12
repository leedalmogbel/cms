const Sequelize = require('sequelize');
const { connectorFactory } = require('../core');
const configValidator = require('./configValidator');

/**
 *
 * @param {Object} config Connector config object
 */
const initialize = (config) => {
  /** validate config input */
  const { isValid, errors } = configValidator(config);
  if (!isValid) {
    throw new Error('Invalid config');
  }

  this.sequelize = new Sequelize(config);
  this.sequelize.DataTypes = Sequelize.DataTypes;
  this.sequelize.isSync = config.isSync;
  /** create sequelize instance */
  return this.sequelize;
};

/**
 * Connect to service
 */
const connect = () => this.sequelize.authenticate();

/**
 * Disconnect from service
 */
const disconnect = () => this.sequelize.close();


const SqlConnector = connectorFactory('sql', initialize, connect, disconnect);

module.exports = SqlConnector;
