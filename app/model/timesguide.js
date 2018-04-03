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
      authorid: STRING(255),
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
          fields: ['created_at']
        },
        {
          fields: ['authorid']
        },
        {
          fields: ['local']
        }
      ],
      getterMethods: {
        picUrl() {
          return 'http://17disney.com/images/timesguide/' + this.picName
        }
      }
    }
  )

  Timesguide.associate = function() {
    app.model.Timesguide.hasMany(app.model.Exchange, {
      as: 'exchanges',
      foreignKey: 'tid'
    })
  }

  return Timesguide
}
