const { EXCHANGE_STATUS } = require('../utils/const')
const moment = require('moment')

module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN, DATE } = app.Sequelize

  const Exchange = app.model.define(
    'exchanges',
    {
      id: {
        type: STRING(255),
        primaryKey: true
      },
      eid: {
        type: STRING(255),
        allowNull: false
      },
      targetEid: {
        type: STRING(255)
      },
      isComplate: {
        type: BOOLEAN,
        defaultValue: false
      }
    },
    {
      getterMethods: {
        updatedAt() {
          return moment(this.updated_at).format('M月D日 H:mm:ss')
        }
      }
    }
  )

  Exchange.associate = function() {
    app.model.Exchange.belongsTo(app.model.Timesguide, {
      as: 'tidInfo',
      foreignKey: 'tid'
    }),
      app.model.Exchange.belongsTo(app.model.Timesguide, {
        as: 'targetTidInfo',
        foreignKey: 'targetTid'
      }),
      app.model.Exchange.belongsTo(app.model.User, {
        as: 'userInfo',
        foreignKey: 'userid'
      }),
      app.model.Exchange.belongsTo(app.model.User, {
        as: 'targetUserInfo',
        foreignKey: 'targetUserid'
      })
  }

  return Exchange
}
