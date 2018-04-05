const moment = require('moment')

module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN, DATE } = app.Sequelize

  const TARGET_TYPE = {
    ALL: 1,
    NOT_HAVE: 2,
    APPOINT: 3
  }

  const STATUS = {
    CLOSE: 0,
    OPEN: 1,
    FINISH: 2
  }

  const Started = app.model.define(
    'starteds',
    {
      id: {
        type: STRING(255),
        primaryKey: true
      },
      eid: {
        type: STRING(255),
        allowNull: false
      },
      status: {
        type: INTEGER,
        defaultValue: STATUS.OPEN
      },
      targetType: {
        type: INTEGER,
        defaultValue: TARGET_TYPE.ALL
      },
      targetLocal: STRING(20)
    },
    {
      getterMethods: {
        createAt() {
          return moment(this.create_at).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    }
  )

  Started.associate = function() {
    app.model.Started.belongsTo(app.model.Timesguide, {
      foreignKey: 'tid'
    })
    app.model.Started.belongsTo(app.model.Timesguide, {
      foreignKey: 'targetTid'
    })
    app.model.Started.belongsTo(app.model.User, {
      foreignKey: 'userid'
    })
  }

  return Started
}
