const moment = require('moment')
const { TIMESGUIDE_CHILDREN_STATUS } = require('../utils/const')

module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN, DATE } = app.Sequelize

  const TimesguideChildren = app.model.define(
    'timesguides_children',
    {
      id: {
        type: STRING(255),
        primaryKey: true
      },
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
      foreignKey: 'tid'
    })
    app.model.TimesguideChildren.belongsTo(app.model.User, {
      foreignKey: 'userid'
    })
  }

  return TimesguideChildren
}
