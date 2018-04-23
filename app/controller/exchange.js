const Controller = require('egg').Controller
const {
  MARK_RULE,
  EXCHANGE_ACTION_TYPE,
  TIMESGUIDE_CHILDREN_STATUS,
  EXCHANGE_STATUS
} = require('../utils/const')
const uuid = require('../utils/uuid')

class ExchangeController extends Controller {
  async list() {
    const { ctx } = this
    const countPerPage = 5
    const { page = 0 } = ctx.query

    ctx.body = await ctx.model.Exchange.findAll({
      // where: {
      //   isComplate: false
      // },

      limit: countPerPage,
      offset: countPerPage * page,

      include: [
        {
          model: ctx.model.Timesguide,
          as: 'tidInfo'
          // attributes: ['picUrl', 'startDate', 'endDate']
        },
        {
          model: ctx.model.Timesguide,
          as: 'targetTidInfo'
          // attributes: ['picUrl', 'startDate', 'endDate']
        },
        {
          model: ctx.model.User,
          as: 'targetUserInfo',
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: ctx.model.User,
          as: 'userInfo',
          attributes: ['id', 'name', 'avatar']
        }
      ],

      order: [['updated_at', 'DESC']]
    })
  }
  async id() {
    const { ctx } = this
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
    tid = parseInt(tid)

    let targetEid
    const id = uuid()

    const user = await ctx.service.user.checkWeappUser()
    const userid = user.id

    if (action === EXCHANGE_ACTION_TYPE.GIVE) {
      // 查询时间表
      const timesguide = await ctx.model.Timesguide.findOne({
        where: { id: tid }
      })

      if (!timesguide) {
        ctx.body = { message: '时间表有误' }
        return
      }

      // 检查已领取的数量
      const available = await ctx.service.exchange.checkGiveAvailable(
        tid,
        userid
      )
      if (available === -1) {
        ctx.body = { available }
        return
      }

      // 检查我的积分
      const userMark = await ctx.service.user.getMark(userid)
      if (userMark < timesguide.price) {
        ctx.body = { message: `你的积分不足，无法领取，剩余积分${userMark}` }
        return
      }

      // 创建新的时间表入自己
      const timesguideChildren = await ctx.service.timesguide.createChildren(
        tid,
        userid
      )

      await ctx.service.user.updateMark(userid, -timesguide.price)

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

      ctx.body = { id, available, targetInfo }
    } else if (action === EXCHANGE_ACTION_TYPE.WITH_NPC) {
      // 检查我的积分
      const userMark = await ctx.service.user.getMark(userid)
      if (userMark < Math.abs(MARK_RULE.EXCHANGE_WITH_NPC)) {
        ctx.body = { message: `你的积分不足，无法兑换，剩余积分${userMark}` }
        return
      }

      // 创建新的时间表入自己
      const timesguideChildren = await ctx.service.timesguide.createChildren(
        tid,
        userid
      )

      // 查询我的时间表
      const timesguide = await ctx.model.TimesguideChildren.findOne({
        where: { id: eid, userid }
      })

      if (!timesguide) {
        ctx.body = { message: '没有找到你的时间表，可能已经交换' }
        return
      }

      if (tid === timesguide.tid) {
        ctx.body = { message: '不能交换相同的时间表' }
        return
      }

      // 将我的时间表给对方
      await ctx.model.TimesguideChildren.update(
        { userid: targetUserid },
        {
          where: { id: eid }
        }
      )

      const create = {
        id,
        eid: timesguide.id,
        tid: timesguide.tid,
        userid,
        targetTid: tid,
        targetEid: timesguideChildren.id,
        targetUserid,
        isComplate: true
      }
      await ctx.model.Exchange.create(create)

      await ctx.service.user.updateMark(userid, MARK_RULE.EXCHANGE_WITH_NPC)

      ctx.body = { id }
    } else if (action === EXCHANGE_ACTION_TYPE.CREATE_WITH_USER) {
      const timesguide = await ctx.model.TimesguideChildren.findOne({
        where: { id: eid }
      })

      if (!timesguide) {
        ctx.body = { message: '没有这个时间表' }
        return
      }

      if (timesguide.status === TIMESGUIDE_CHILDREN_STATUS.STARTED) {
        ctx.body = { message: '这张时间表正在交换中' }
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
      ctx.body = { id }
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

    if (!exchange) {
      ctx.body = { message: '没有这个交换，可能对方已交换' }
      return
    }

    // 查询我的时间表
    const timesguide = await ctx.model.TimesguideChildren.findOne({
      where: { id: eid, userid }
    })

    if (!timesguide) {
      ctx.body = { message: '没有找到你的时间表，可能你已经交换' }
      return
    }

    if (exchange.tid === timesguide.tid) {
      ctx.body = { message: '不能交换相同的时间表' }
      return
    }

    if (exchange.userid === userid) {
      ctx.body = { message: '不能和自己交换' }
      return
    }

    // 将我的时间表给对方
    await ctx.model.TimesguideChildren.update(
      {
        userid: exchange.userid,
        status: TIMESGUIDE_CHILDREN_STATUS.OPEN
      },
      {
        where: { id: eid }
      }
    )

    // 将对方时间表给我
    await ctx.model.TimesguideChildren.update(
      {
        userid,
        status: TIMESGUIDE_CHILDREN_STATUS.OPEN
      },
      {
        where: { id: exchange.eid }
      }
    )

    // 更新交易记录
    const update = {
      targetEid: eid,
      targetTid: timesguide.tid,
      targetUserid: userid,
      isComplate: true
    }
    await ctx.model.Exchange.update(update, {
      where: { id }
    })

    // 双方添加积分
    await ctx.service.user.updateMark(
      exchange.userid,
      MARK_RULE.EXCHANGE_WITH_USER
    )
    await ctx.service.user.updateMark(userid, MARK_RULE.EXCHANGE_WITH_USER)

    const content = `恭喜！会员 ${user.name} 与你交换了时间表！`
    await ctx.service.message.newMessage(content, exchange.userid)

    ctx.body = { id }
  }
}

module.exports = ExchangeController
