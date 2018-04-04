const Controller = require('egg').Controller

class TimesguideController extends Controller {
  async list() {
    const { ctx } = this
    const { local = 'shanghai' } = ctx.query
    const list = await ctx.model.Timesguide.findAll({
      where: {
        local
      },
      order: [['startDate', 'ASC']]
    })
    ctx.body = list
  }

  async id() {
    const { ctx } = this
    const { id } = ctx.params
    const data = await ctx.model.Timesguide.findOne({
      where: {
        id
      },
      include: [
        {
          model: ctx.model.User,
          attributes: ['id', 'avatar', 'name']
        }
      ]
    })
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
  async userList() {
    this.ctx.body = 'hi, egg'
  }

  async userUploadTid() {
    this.ctx.body = 'hi, egg'
  }
}

module.exports = TimesguideController
