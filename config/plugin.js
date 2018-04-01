'use strict'

// had enabled by egg
exports.static = true

exports.redis = {
  enable: true,
  package: 'egg-redis'
}

exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis'
}

exports.weappSDK = {
  enable: true,
  package: 'egg-weapp-sdk'
}

exports.validate = {
  enable: true,
  package: 'egg-validate'
}

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize'
}
