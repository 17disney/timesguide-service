module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN } = app.Sequelize

  const Timesguide = app.model.define(
    'ds_timesguide',
    {
      start_date: STRING(255),
      end_date: STRING(255),
      local: STRING(20),
      rate: {
        type: INTEGER,
        defaultValue: 0
      },
      author: STRING(255),
      have_num: {
        type: INTEGER,
        defaultValue: 0
      },
      available: {
        type: INTEGER,
        defaultValue: 0
      },
      is_show: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      indexes: [
        {
          fields: ['start_date']
        }
      ]
    }
  )
  return Timesguide
}
