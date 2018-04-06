const Service = require('egg').Service
const { MAX_GIVE } = require('../utils/const')

// const MESSAGE_TYPE = {


// }


// const MESSAGE_CONTENT = {
//   EXCHANGE_SUCCESS: ''

// }

class MessageService extends Service {
  newMessage(content, userid) {
    const {ctx} = this
    const create = {
      title: '提示',
      content,
      userid
    }
    ctx.model.Message.create(create)
  }
}

module.exports = MessageService
