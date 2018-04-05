const moment = require('moment')

module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN, DATE } = app.Sequelize

  const TimesguideChild = app.model.define(
    'timesguides_child',
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

  TimesguideChild.associate = function() {
    app.model.TimesguideChild.belongsTo(app.model.TimesguideChild, {
      foreignKey: 'tid'
    })
    app.model.TimesguideChild.belongsTo(app.model.User, {
      foreignKey: 'userid'
    })
  }

  return TimesguideChild
}
