const moment = require('moment')
const { TIMESGUIDE_CHILDREN_STATUS, TIMESGUIDE_TYPE } = require('../utils/const')


// 时间表子类
module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN, DATE } = app.Sequelize

  const TimesguideChildren = app.model.define(
    'timesguides_children',
    {
      id: {
        type: STRING(255),
        primaryKey: true
      },
      mediaUrl: STRING(255),
      oUserid: STRING(255),
      type: TYPE.TIMESGUIDE,
      status: {
        type: INTEGER,
        defaultValue: TIMESGUIDE_CHILDREN_STATUS.OPEN,
        allowNull: false
      }
    },
    {
      indexes: [
        {
          fields: ['created_at']
        }
      ]
    }
  )

  TimesguideChildren.associate = function() {
    app.model.TimesguideChildren.belongsTo(app.model.Timesguide, {
      as: 'tidInfo',
      foreignKey: 'tid',
    })
    app.model.TimesguideChildren.belongsTo(app.model.User, {
      foreignKey: 'userid'
    })
  }

  return TimesguideChildren
}
