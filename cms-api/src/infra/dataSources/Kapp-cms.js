
module.exports = {
  name: 'kapp-cms',
  connector : 'sql',
  config: {
    host: '127.0.0.1',
    username: 'postgres',
    password: 'root',
    database: 'kapp',
    dialect: 'postgres',
    isSync: 'true',

  }
};
