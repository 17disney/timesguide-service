module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN } = app.Sequelize

  const Message = app.model.define(
    'ds_message',
    {
      is_read: BOOLEAN,
      type: INTEGER,
      uid: INTEGER,
      title: STRING,
      content: STRING
    },
    {
      indexes: [
        {
          fields: ['uid']
        }
      ]
    }
  )
  return Message
}
