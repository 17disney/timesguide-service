const Controller = require('egg').Controller
const crypto = require('crypto')
const uuid = require('../utils/uuid')

class contributeController extends Controller {
  async list() {
    const { ctx } = this
    const { isActive } = ctx.query

    let where = {}
    if (isActive) where.isActive = isActive
    if (isActive === 1 || isActive === true) where.rate = { $gt: 0 }

    const data = await ctx.model.Contribute.findAll({
      where
    })
    ctx.body = data
  }
  async create() {
    const { ctx } = this
    const { type, tid, startDate, endDate, local, picUrl } = ctx.request.body

    const userInfo = await ctx.service.user.checkWeappUser()

    const contribute = await ctx.model.Contribute.findOne({
      where: {
        picUrl
      },
      order: [['updated_at', 'DESC']]
    })

    if (contribute) {
      ctx.body = { message: '你已经提交过该图片，请勿重复提交' }
      return
    }

    const create = {
      id: uuid(),
      tid,
      userid: userInfo.id,
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
