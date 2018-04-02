module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN } = app.Sequelize

  const Timesguide_author = app.model.define(
    'ds_timesguide_author',
    {
      uid: {
        type: INTEGER
      },
      tid: {
        type: INTEGER
      },
      rate: {
        type: INTEGER,
        defaultValue: 0
      },
      mark: {
        type: INTEGER,
        defaultValue: 0
      },
      is_verify: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      indexes: [
        {
          fields: ['uid']
        },
        {
          fields: ['tid']
        },
        {
          fields: ['start_date']
        }
      ]
    }
  )
  return Timesguide_author
}
