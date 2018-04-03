const Controller = require('egg').Controller
const { DEAL_TYPE } = require('../utils/const')
const uuid = require('../utils/uuid')

class ExchangeController extends Controller {
  async list() {
    this.ctx.body = 'hi, egg'
  }
  async id() {
    this.ctx.body = 'hi, egg'
  }

  // 交易
  async deal() {
    const { ctx } = this
    const { tid } = ctx.params
    const { type } = ctx.request.body

    const userInfo = await ctx.service.user.checkWeappUser()
    const targetInfo = await ctx.service.disney.getRandom()

    const { userid } = userInfo

    const create = {
      id: uuid(),
      tid,
      userid,
      type,
      targetid: targetInfo['id'],
      status: 1
    }

    await ctx.model.Exchange.create(create)
    ctx.body = create
  }

  async disneyFirend() {}

  async create() {
    this.ctx.body = 'hi, egg'
  }
  async users() {
    this.ctx.body = 'hi, egg'
  }
}

module.exports = ExchangeController
