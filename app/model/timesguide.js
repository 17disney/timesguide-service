const moment = require('moment')

module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN, DATE } = app.Sequelize

  const Timesguide = app.model.define(
    'timesguides',
    {
      startDate: DATE,
      endDate: DATE,
      local: STRING(20),
      rate: {
        type: INTEGER,
        defaultValue: 0
      },
      picName: STRING(255),
      haveNum: {
        type: INTEGER,
        defaultValue: 0
      },
      exchangeNum: {
        type: INTEGER,
        defaultValue: 0
      }
    },
    {
      indexes: [
        {
          fields: ['startDate']
        },
        {
          fields: ['local']
        },
        {
          fields: ['created_at']
        }
      ],
      getterMethods: {
        picUrl() {
          return 'http://17disney.com/images/timesguide/' + this.picName
        },
        dateRang() {
          const startDate = moment(this.startDate).format('YYYY.MM.DD')
          const endDate = moment(this.endDate).format('MM.DD')
          return startDate + '-' + endDate
        }
      }
    }
  )

  Timesguide.associate = function() {
    app.model.Timesguide.hasMany(app.model.Exchange, {
      foreignKey: 'tid'
    })
    app.model.Timesguide.hasMany(app.model.Contribute, {
      foreignKey: 'tid'
    })
    app.model.Timesguide.hasMany(app.model.Started, {
      foreignKey: 'tid'
    })
    app.model.Timesguide.belongsTo(app.model.User, {
      foreignKey: 'userid'
    })
  }

  return Timesguide
}
