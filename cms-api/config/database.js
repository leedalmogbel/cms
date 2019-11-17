const yaml = require('js-yaml');
const fs = require('fs');

const env = yaml.safeLoad(fs.readFileSync('env.yml', 'utf8'));

module.exports = {
  local: {
    username: env.local.DB_USERNAME,
    password: env.local.DB_PASSWORD,
    database: env.local.DB_NAME,
    host: env.local.DB_HOST,
    dialect: env.local.DB_DIALECT,
  },
  dev: {
    username: env.dev.DB_USERNAME,
    password: env.dev.DB_PASSWORD,
    database: env.dev.DB_NAME,
    host: env.dev.DB_HOST,
    dialect: env.dev.DB_DIALECT,
  },
  uat: {
    username: env.uat.DB_USERNAME,
    password: env.uat.DB_PASSWORD,
    database: env.uat.DB_NAME,
    host: env.uat.DB_HOST,
    dialect: env.uat.DB_DIALECT,
  },
  prod: {
    username: env.prod.DB_USERNAME,
    password: env.prod.DB_PASSWORD,
    database: env.prod.DB_NAME,
    host: env.prod.DB_HOST,
    dialect: env.prod.DB_DIALECT,
  },
};
