// 贡献时间表

module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN, DATE } = app.Sequelize

  const Contribute = app.model.define(
    'contributes',
    {
      id: {
        type: STRING(255),
        primaryKey: true
      },
      local: STRING(20),
      startDate: DATE,
      endDate: DATE,
      picUrl: STRING(255),
      rate: {
        type: INTEGER,
        defaultValue: 0
      },
      isActive: {
        type: BOOLEAN,
        defaultValue: false
      }
    },
    {
      indexes: [],
      getterMethods: {}
    }
  )
  Contribute.associate = function() {
    app.model.Contribute.belongsTo(app.model.Timesguide, {
      foreignKey: 'tid'
    })
    app.model.Contribute.belongsTo(app.model.User, {
      foreignKey: 'userid'
    })
  }
  return Contribute
}
