'use strict'

module.exports = appInfo => {
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1522461581637_7339'

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: '17disney-timesguide',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: 'root'
  }

  config.redis = {
    client: {
      host: '127.0.0.1',
      port: '6379',
      password: '',
      db: '0'
    }
  }
  config.sessionRedis = {
    name: '' // single redis does not need to config name
  }

  config.weappSDK = {
    appId: '', // your weapp appId
    appSecret: '', // weapp appSecret
  };

  // add your config here
  config.middleware = []

  return config
}
