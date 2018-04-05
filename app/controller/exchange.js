const Controller = require('egg').Controller
const {
  EXCHANGE_ACTION_TYPE,
  MAX_GIVE,
  TIMESGUIDE_CHILDREN_STATUS,
  EXCHANGE_STATUS
} = require('../utils/const')
const uuid = require('../utils/uuid')

class ExchangeController extends Controller {
  async list() {
    this.ctx.body = 'hi, egg'
  }
  async id() {
    this.ctx.body = 'hi, egg'
  }

  // 创建交换 / 创建与NPC交换 / 领取
  async create() {
    const { ctx } = this
    const { action, tid } = ctx.request.body

    let { eid, targetTid, targetUserid } = ctx.request.body

    let targetEid
    const id = uuid()

    const user = await ctx.service.User.checkWeappUser()
    const userid = user.id

    if (action === EXCHANGE_ACTION_TYPE.GIVE) {
      // 检查已领取的数量
      const available = await ctx.service.Exchange.checkGiveAvailable(
        tid,
        userid
      )
      if (available === -1) {
        ctx.body = { available }
        return
      }

      // 创建新的时间表入自己
      const timesguideChildren = await ctx.service.Timesguide.createChildren(
        tid,
        userid
      )
      // 随机获取赠与人
      const targetInfo = await ctx.service.disney.getRandom()

      // 创建交易记录
      const create = {
        id,
        eid: timesguideChildren.id,
        tid,
        userid,
        targetUserid: targetInfo.id,
        isOriginal: true
      }
      await ctx.model.Exchange.create(create)

      create.targetInfo = targetInfo
      create.available = available

      ctx.body = create
    } else if (action === EXCHANGE_ACTION_TYPE.WITH_NPC) {
      // 创建新的时间表入自己
      const timesguideChildren = await ctx.service.Timesguide.createChildren(
        tid,
        userid
      )
      // 将时间表移主
      await ctx.service.TimesguideChildren.update(
        { userid: targetUserid },
        {
          where: { eid }
        }
      )

      // 创建交易记录
      const create = {
        id,
        eid: timesguideChildren.id,
        tid,
        userid,
        targetUserid,
        isOriginal: true
      }
      await ctx.model.Exchange.create(create)
      ctx.body = create
    } else if (action === EXCHANGE_ACTION_TYPE.WITH_USER) {
      // 将时间表锁定
      await ctx.service.TimesguideChildren.update(
        { status: STARTED },
        {
          where: { eid }
        }
      )

      // 创建交易记录
      const create = {
        id,
        eid,
        tid,
        userid,
        isOriginal: false
      }
      await ctx.model.Exchange.create(create)
      ctx.body = create
    }
  }

  // 加入交换
  async join() {
    const { ctx } = this
    const { id, eid, targetEid } = ctx.request.body

    const user = await ctx.service.User.checkWeappUser()
    const userid = user.id

    // 查询交易
    const exchange = await ctx.model.Exchange.findOne({
      where: { id }
    })

    // 查询我的时间表
    const timesguide = await ctx.model.TimesguideChildren.findOne({
      where: { eid }
    })

    // 对方时间表移主
    await ctx.service.TimesguideChildren.update(
      { userid },
      {
        where: { id: targetEid }
      }
    )

    // 我方时间表移主
    await ctx.service.TimesguideChildren.update(
      { userid: exchange.userid },
      {
        where: { id: eid }
      }
    )

    // 更新交易记录
    const update = {
      targetEid: eid,
      targetTid: timesguide.tid,
      targetUserid: userid
    }
    await ctx.model.Exchange.update(update, {
      where: { id }
    })

    ctx.body = update
  }
}

module.exports = ExchangeController
