module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN, DATE } = app.Sequelize

  const STATUS = {
    DELETED: 0,
    HAVE: 1,
    SELL: 2
  }

  const Exchange = app.model.define(
    'exchanges',
    {
      id: {
        type: STRING(255),
        primaryKey: true
      },
      status: {
        type: INTEGER,
        default: STATUS.HAVE
      }
    }
  )

  Exchange.associate = function() {
    app.model.Exchange.belongsTo(app.model.Timesguide, {
      foreignKey: 'tid'
    }),
    app.model.Exchange.belongsTo(app.model.Timesguide, {
      foreignKey: 'targetTid'
    }),
    app.model.Exchange.belongsTo(app.model.User, {
      foreignKey: 'userid'
    }),
    app.model.Exchange.belongsTo(app.model.User, {
      foreignKey: 'targetUserid'
    })
  }

  return Exchange
}
