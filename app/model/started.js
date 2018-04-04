module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN, DATE } = app.Sequelize

  const TARGET_TYPE = {
    ALL: 1,
    NOT_HAVE: 2,
    APPOINT: 3
  }
  const Started = app.model.define(
    'starteds',
    {
      id: {
        type: STRING(255),
        primaryKey: true
      },
      targetType: {
        type: INTEGER,
        defaultValue: TARGET_TYPE.ALL
      },
      targetLocal: STRING(20)
    },
    { underscored: false }
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
