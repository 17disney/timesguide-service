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
      picUrl: STRING(255),
      have: {
        type: INTEGER,
        defaultValue: 0
      },
      exchange: {
        type: INTEGER,
        defaultValue: 0
      },
      contribute: {
        type: INTEGER,
        defaultValue: 0
      },
      started: {
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
        dateRang() {
          const startDate = moment(this.startDate).format('YYYY.MM.DD')
          const endDate = moment(this.endDate).format('MM.DD')
          return startDate + '-' + endDate
        },
        price() {
          const days = moment().diff(moment(this.startDate), 'days')
          if (days <= 7) {
            return 0
          }
          return 20 + Math.ceil(days / 90) * 10
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
    app.model.Timesguide.hasMany(app.model.TimesguideChildren, {
      foreignKey: 'tid'
    })
    app.model.Timesguide.belongsTo(app.model.User, {
      foreignKey: 'userid'
    })
  }

  return Timesguide
}
