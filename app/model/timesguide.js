module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN } = app.Sequelize
  
  const Timesguide = app.model.define(
    'timesguide',
    {
      name: {
        type: STRING(100),
        unique: true,
        allowNull: false
      },
      startDate: STRING(255),
      endDate: STRING(255),
      author: STRING(255)
    },
    {
      indexes: [
        {
          fields: ['name']
        }
      ]
    }
  )
  return Timesguide
}
