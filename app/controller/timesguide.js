'use strict'

const Controller = require('egg').Controller

class TimesguideController extends Controller {
  async list() {
    const { ctx } = this
    const { local } = ctx.query
    const list = await ctx.model.Timesguide.findAll({
      where: [
        {
          local
        }
      ],
      order: [['start_date', 'ASC']]
    })
    // ctx.body = ctx.model
    ctx.body = list
  }
  async id() {
    this.ctx.body = 'hi, egg'
  }
  async uploadId() {}
  async userList() {
    this.ctx.body = 'hi, egg'
  }

  async userUploadTid() {
    this.ctx.body = 'hi, egg'
  }
}

module.exports = TimesguideController
