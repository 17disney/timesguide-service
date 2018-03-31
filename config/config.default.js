'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1522461581637_7339';

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: '17disney-timesguide',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: 'root',
  };

  // add your config here
  config.middleware = [];

  return config;
};
