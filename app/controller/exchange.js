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
    await ctx.model.TimesguideChildren.create(children)

    // 获取赠与人信息
    const targetInfo = await ctx.service.disney.getRandom()

    // 创建交易
    const create = {
      id: uuid(),
      eid,
      userid,
      tid,
      targetUserid: targetInfo['id'],
      status: 1
    }
    await ctx.model.Exchange.create(create)

    create.targetInfo = targetInfo
    create.available = available

    ctx.body = create
  }

  // 创建交换
  async create() {
    const { ctx } = this

    const user = await ctx.service.user.checkWeappUser()
    const userid = user.id

    const {
      eid,
      tid,
      type,
      targetUserid,
      targetTid,
      targetEid
    } = ctx.request.body

    // 更新持有人
    await ctx.model.TimesguideChildren.update(
      {
        userid: targetUserid
      },
      {
        where: {
          id: eid
        }
      }
    )


    if (type === 2) {
      // NPC 生成卡片
      const targetEid = uuid()
      const children = {
        id: targetEid,
        userid: targetUserid,
        tid: targetTid
      }
      await ctx.model.TimesguideChildren.create(children)
    }



    // 创建交易
    const exchange = {
      id: uuid(),
      userid,
      eid: targetEid,
      tid: targetTid,
      targetUserid: userid,
      targetTid: tid,
      targetEid: eid
    }

    await ctx.model.Exchange.create(exchange)

    ctx.body = exchange
  }
}

module.exports = ExchangeController
