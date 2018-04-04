const Controller = require('egg').Controller
const crypto = require('crypto')
const uuid = require('../utils/uuid')

class contributeController extends Controller {
  async create() {
    const { ctx } = this
    const { type, tid, startDate, endDate, local, picUrl } = ctx.request.body

    const userInfo = await ctx.service.user.checkWeappUser()

    const { userid } = userInfo

    const create = {
      id: uuid(),
      tid,
      userid,
      type,
      startDate,
      endDate,
      local,
      picUrl,
      status: 1
    }

    await ctx.model.Contribute.create(create)
    ctx.body = create
  }

  async delete() {
    const { ctx } = this
  }
}

module.exports = contributeController
