const Service = require('egg').Service
const uuid = require('../utils/uuid')

class TimesguideService extends Service {
  async createChildren(tid, userid) {
    const { ctx } = this
    const id = uuid()
    const children = {
      id,
      userid,
      tid
    }
    await ctx.model.TimesguideChildren.create(children)
    return children
  }
}

module.exports = TimesguideService
