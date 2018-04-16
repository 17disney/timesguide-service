const Controller = require('egg').Controller
const crypto = require('crypto')
const uuid = require('../utils/uuid')
const { MESSAGE_TYPE, RATE_MARK } = require('../utils/const')

class contributeController extends Controller {
  async list() {
    const { ctx } = this
    const { isActive } = ctx.query

    let where = {}
    if (isActive) where.isActive = isActive
    if (isActive === 1 || isActive === true) where.rate = { $gt: 0 }

    const data = await ctx.model.Contribute.findAll({
      include: [
        {
          model: ctx.model.User,
          attributes: ['id', 'avatar', 'name']
        }
      ],
      where,
      order: [['created_at', 'DESC']]
    })
    ctx.body = data
  }

  async id() {
    const { ctx } = this
    const { id } = ctx.params

    const data = await ctx.model.Contribute.findOne({
      where: {
        id
      }
    })
    ctx.body = data
  }

  async deleteId() {
    const { ctx } = this
    const { id } = ctx.params

    const userid = ctx.userinfo.id
    await ctx.model.Contribute.destroy({
      where: {
        id,
        userid
      }
    })
    ctx.body = { id }
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

  async active() {
    const { ctx } = this
    const { id } = ctx.params

    const { rate, startDate, endDate, local, picUrl } = ctx.request.body

    let { tid } = ctx.request.body
    const contribute = await ctx.model.Contribute.findOne({
      where: { id }
    })

    if (!contribute) {
      ctx.body = { message: '没有这个贡献' }
      return
    }

    const { userid, isActive } = contribute

    if (!userid) {
      ctx.body = { message: '没有用户id' }
      return
    }

    if (isActive) {
      ctx.body = { message: '已经审核' }
      return
    }

    if (rate === 0) {
      await ctx.model.Contribute.update(
        {
          rate,
          isActive: true
        },
        {
          where: { id }
        }
      )
      const content = `很遗憾你提交的时间表 ${id.substr(0, 6)} 没有通过审核`
      ctx.service.message.newMessage(content, userid, MESSAGE_TYPE.CONTRIBUTE)
      ctx.body = { message: '审核完毕' }
      return
    } else {
      if (tid) {
        await ctx.model.Timesguide.update(
          {
            userid,
            picUrl
          },
          {
            where: { id: tid }
          }
        )
      } else {
        const newTimesguide = await ctx.model.Timesguide.create({
          userid,
          picUrl,
          startDate,
          endDate,
          local,
          rate
        })

        tid = newTimesguide.id
      }
    }

    await ctx.model.Contribute.update(
      {
        picUrl,
        tid,
        startDate,
        endDate,
        local,
        rate,
        isActive: true
      },
      {
        where: { id }
      }
    )

    
    await ctx.service.user.updateMark(userid, RATE_MARK[rate])
    const content = `恭喜，你的时间表 ${id.substr(0, 6)} 通过审核，并获得 ${RATE_MARK[rate]} 点积分和 5 张该时间表！`
    ctx.service.message.newMessage(content, userid, MESSAGE_TYPE.CONTRIBUTE)

    for (let i = 0; i < 5; i++) {
      await ctx.service.exchange.createTimesguideChild(tid, userid)
    }

    ctx.body = { message: '审核完毕' }
  }
}

module.exports = contributeController
