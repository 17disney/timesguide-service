const moment = require('moment')

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
      type: INTEGER,
      isActive: {
        type: BOOLEAN,
        defaultValue: false
      }
    },
    {
      indexes: [],
      getterMethods: {
        dateRang() {
          const startYearDate = moment(this.startDate).format('YYYY.MM.DD')
          const startDate = moment(this.endDate).format('MM.DD')
          const endDate = moment(this.endDate).format('MM.DD')
          if (startDate === endDate) {
            return startYearDate
          } else {
            return startDate + '-' + endDate
          }
        }
      }
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
