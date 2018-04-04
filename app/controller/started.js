const Controller = require('egg').Controller
const crypto = require('crypto')
const uuid = require('../utils/uuid')

class startedController extends Controller {
  async create() {
    const { ctx } = this
    const { targetType, tid, targetLocal, targetTid } = ctx.request.body

    const userInfo = await ctx.service.user.checkWeappUser()

    const { userid } = userInfo

    const create = {
      id: uuid(),
      tid,
      userid,
      targetType,
      targetLocal,
      targetTid
    }

    await ctx.model.Started.create(create)
    ctx.body = create
  }

  async delete() {
    const { ctx } = this
  }
}

module.exports = startedController
