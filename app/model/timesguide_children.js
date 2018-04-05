const moment = require('moment')

module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN, DATE } = app.Sequelize

  const TimesguideChildren = app.model.define(
    'timesguides_children',
    {
      id: {
        type: STRING(255),
        primaryKey: true
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