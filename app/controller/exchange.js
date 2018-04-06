const Controller = require('egg').Controller
const {
  EXCHANGE_ACTION_TYPE,
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
    const { action } = ctx.request.body

    /* 
    eid: 我的时间表原始值（必须）
    tid: 我需要的时间表（只用于和NPC交换）
    targetUserid：(我需要的交换对象，只用于和NPC交换)
    */
    let { tid, eid, targetUserid } = ctx.request.body

    let targetEid
    const id = uuid()

    const user = await ctx.service.user.checkWeappUser()
    const userid = user.id

    if (action === EXCHANGE_ACTION_TYPE.GIVE) {
      // 检查已领取的数量
      const available = await ctx.service.exchange.checkGiveAvailable(
        tid,
        userid
      )
      if (available === -1) {
        ctx.body = { available }
        return
      }

      // 创建新的时间表入自己
      const timesguideChildren = await ctx.service.timesguide.createChildren(
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
        isComplate: true
      }
      await ctx.model.Exchange.create(create)

      create.targetInfo = targetInfo
      create.available = available

      ctx.body = create
    } else if (action === EXCHANGE_ACTION_TYPE.WITH_NPC) {
      // 创建新的时间表入自己
      const timesguideChildren = await ctx.service.timesguide.createChildren(
        tid,
        userid
      )
      // 将时间表移主
      await ctx.model.TimesguideChildren.update(
        { userid: targetUserid },
        {
          where: { id:eid }
        }
      )

      // 创建交易记录
      const create = {
        id,
        eid: timesguideChildren.id,
        tid,
        userid,
        targetUserid,
        isComplate: true
      }
      await ctx.model.Exchange.create(create)
      ctx.body = create
    } else if (action === EXCHANGE_ACTION_TYPE.CREATE_WITH_USER) {
      const timesguide = await ctx.model.TimesguideChildren.findOne({
        where: { id: eid }
      })

      if (!timesguide) {
        ctx.body = { massage: '没有这个时间表' }
        return
      }

      if (timesguide.status === TIMESGUIDE_CHILDREN_STATUS.STARTED) {
        ctx.body = { massage: '这张时间表正在交换中' }
        return
      }

      // 将时间表锁定
      await ctx.model.TimesguideChildren.update(
        { status: TIMESGUIDE_CHILDREN_STATUS.STARTED },
        {
          where: { id: eid }
        }
      )

      // 创建交易记录
      const create = {
        id,
        eid,
        tid: timesguide.tid,
        userid,
        isComplate: false
      }
      await ctx.model.Exchange.create(create)
      ctx.body = create
    }
  }

  // 加入交换
  async join() {
    const { ctx } = this
    const { id } = ctx.params
    const { eid } = ctx.request.body

    /* 
    id: 需要加入的交易号
    eid: 我的时间表原始值
    */

    const user = await ctx.service.user.checkWeappUser()
    const userid = user.id

    // 查询对方创建的交易
    const exchange = await ctx.model.Exchange.findOne({
      where: { id }
    })

    if (!timesguide) {
      ctx.body = { massage: '没有这个交易' }
      return
    }

    // 查询我的时间表
    const timesguide = await ctx.model.TimesguideChildren.findOne({
      where: { eid }
    })

    if (!timesguide) {
      ctx.body = { massage: '我的时间表有误' }
      return
    }

    // 将我的时间表给对方
    await ctx.service.timesguideChildren.update(
      { userid: exchange.userid },
      {
        where: { id: eid }
      }
    )

    // 将对方时间表给我
    await ctx.service.timesguideChildren.update(
      { userid },
      {
        where: { id: exchange.eid }
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
