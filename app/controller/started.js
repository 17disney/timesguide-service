const Controller = require('egg').Controller
const crypto = require('crypto')
const uuid = require('../utils/uuid')

class startedController extends Controller {
  async create() {
    const { ctx } = this
    const { eid, targetType, tid, targetLocal, targetTid } = ctx.request.body

    const user = await ctx.service.user.checkWeappUser()
    const create = {
      id: uuid(),
      eid,
      tid,
      userid: user.id,
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
