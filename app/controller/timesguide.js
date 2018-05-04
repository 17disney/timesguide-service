const Controller = require('egg').Controller
const { TIMESGUIDE_CHILDREN_STATUS } = require('../utils/const')

class TimesguideController extends Controller {
  async list() {
    const { ctx } = this
    const { local = 'shanghai' } = ctx.query
    const list = await ctx.model.Timesguide.findAll({
      where: {
        local,
        rate: { $gt: 0 }
      },
      include: [
        {
          model: ctx.model.TimesguideChildren,
          attributes: ['id', 'status']
          // where: {
          //   status: TIMESGUIDE_CHILDREN_STATUS.STARTED
          // }
        }
      ],
      order: [['startDate', 'ASC']]
    })
    ctx.body = list
  }

  async listV2() {
    const { ctx } = this
    const { local = 'shanghai', type, year } = ctx.query

    const where = {
      local,
      type
    }

    const list = await ctx.model.Timesguide.findAll({
      attributes: [
        'id',
        'type',
        'started',
        'have',
        'picUrl',
        'startDate',
        'endDate'
      ],
      where,
      order: [['startDate', 'ASC']]
    })
    ctx.body = list
  }

  async id() {
    const { ctx } = this
    const { id } = ctx.params
    // const {rate} = ctx.query
    let data = await ctx.model.Timesguide.findOne({
      where: {
        id
      },
      include: [
        {
          model: ctx.model.User,
          attributes: ['id', 'avatar', 'name']
        },
        {
          model: ctx.model.TimesguideChildren,
          attributes: ['id', 'status']
        }
      ]
    })

    const have = await ctx.model.Exchange.count({
      where: {
        tid: id,
        targetTid: null
      }
    })

    const exchange = await ctx.model.Exchange.count({
      where: {
        tid: id
      }
    })

    data.have = have
    data.exchange = exchange

    this.ctx.body = data
  }

  async create() {}

  async uploadId() {
    const { ctx } = this
    const data = ctx.request.body
    const { id, author, startDate, endDate, local, picName, rate } = data
    const res = await ctx.model.Timesguide.update(
      {
        author,
        startDate,
        endDate,
        local,
        picName,
        rate
      },
      { where: { id } }
    )
    ctx.body = { id }
  }

  async starteds() {
    const { ctx } = this
    const { id } = ctx.params
    const { status = 1 } = ctx.query
    const data = await ctx.model.Exchange.findAll({
      where: {
        tid: id,
        isComplate: false
      },
      include: [
        {
          as: 'userInfo',
          model: ctx.model.User,
          attributes: ['id', 'avatar', 'name']
        }
      ]
    })

    let list = []
    let check = new Set()
    data.forEach(item => {
      const { id, eid, userInfo } = item
      const userid = userInfo.id

      if (!check.has(userid)) {
        list.push({
          id: userid,
          exid: id,
          eid,
          avatar: userInfo.avatar,
          name: userInfo.name
        })
        check.add(userid)
      }
    })

    if (list.length < 5) {
      for (let i = 0; i <= 5; i++) {
        const disneyFriend = await ctx.service.disney.getRandom()
        list.push(disneyFriend)
      }
    }

    ctx.body = list
  }

  async userList() {
    this.ctx.body = 'hi, egg'
  }

  async userUploadTid() {
    this.ctx.body = 'hi, egg'
  }
}

module.exports = TimesguideController
