const moment = require('moment')

module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN } = app.Sequelize

  const TYPE = {
    DEFAULT: 0,
    REWARD: 1,
    TIPS: 2
  }

  const Message = app.model.define(
    'messages',
    {
      id: {
        type: STRING(255),
        primaryKey: true
      },
      isRead: {
        type: BOOLEAN,
        defaultValue: false
      },
      type: {
        type: INTEGER,
        defaultValue: TYPE.DEFAULT
      },
      title: {
        type: STRING,
        allowNull: false
      },
      content: {
        type: STRING,
        allowNull: false
      }
    },
    {
      getterMethods: {
        createAt() {
          return moment(this.create_at).format('YYYY年MM月DD日 HH:mm:ss')
        }
      }
    }
  )

  Message.associate = function() {
    app.model.Message.belongsTo(app.model.User, {
      foreignKey: 'userid'
    })
  }

  return Message
}
