
module.exports = {
  name: 'kapp-cms',
  connector: 'sql',
  config: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    isSync: 'false',
    pool: {
      max: 50,
      min: 0,
      idle: 10,
    },
    timezone: 'Asia/Manila',
    dialectOptions: {
      useUTC: false,
      dateStrings: true,
      typeCast(field, next) {
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      },
    },
  },
};
