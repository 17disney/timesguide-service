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

  // 领取时间表
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
    const available = MAX_GIVE - exchangeCount

    if (available === -1) {
      ctx.body = { available }
      return
    }
    
    // 生成卡片
    const eid = uuid()
    const children = {
      id: eid,
      userid,
      tid
    }
    console.log(children)
    await ctx.model.TimesguideChildren.create(children)

    // 获取赠与人信息
    const targetInfo = await ctx.service.disney.getRandom()
    
    // 创建交易
    const create = {
      id: uuid(),
      eid,
      userid,
      tid,
      type: 1,
      targetUserid: targetInfo['id'],
      status: 1
    }
    await ctx.model.Exchange.create(create)

    create.targetInfo = targetInfo
    create.available = available

    ctx.body = create
  }

  async create() {
    const { ctx } = this
    const {
      id,
      tid,
      type,
      targetUserid,
      targetTid,
      targetId
    } = ctx.request.body

    const arg = {
      id,
      tid,
      type,
      targetUserid,
      targetTid,
      targetId
    }

    const data = await ctx.model.Exchange.create(arg)

    ctx.body = data
  }
}

module.exports = ExchangeController
