const Controller = require('egg').Controller
const { DEAL_TYPE, MAX_GIVE } = require('../utils/const')
const uuid = require('../utils/uuid')

class ExchangeController extends Controller {
  async list() {
    this.ctx.body = 'hi, egg'
  }
  async id() {
    this.ctx.body = 'hi, egg'
  }

  async friends() {
    const { ctx } = this
    ctx.body = await ctx.service.disney.getAll()
  }

  // 交易
  async deal() {
    const { ctx } = this
    const { tid } = ctx.params

    const user = await ctx.service.user.checkWeappUser()
    const userid = user.id

    // 检查已领取的数量
    const exchangeCount = await ctx.model.Exchange.count({
      where: {
        userid,
        tid,
        targetTid: null
      }
    })

    const targetInfo = await ctx.service.disney.getRandom()
    const available = MAX_GIVE - exchangeCount

    if (available === -1) {
      ctx.body = { available }
      return
    }

    const create = {
      id: uuid(),
      userid,
      tid,
      type: 1,
      targetUserid: targetInfo['id'],
      status: 1
    }
    await ctx.model.Exchange.create(create)

    create.available = available
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
