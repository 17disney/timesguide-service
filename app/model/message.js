const moment = require('moment')
const { MESSAGE_TYPE } = require('../utils/const')

module.exports = app => {
  const { STRING, TEXT, INTEGER, BOOLEAN } = app.Sequelize

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
        defaultValue: MESSAGE_TYPE.DEFAULT
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
