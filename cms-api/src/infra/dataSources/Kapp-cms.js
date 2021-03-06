
module.exports = {
  name: 'kapp-cms',
  connector: 'sql',
  config: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    isSync: false,
    pool: {
      max: 2,
      min: 0,
      idle: 10000,
    },
    logging: false,
    timezone: '+08:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  },
};
