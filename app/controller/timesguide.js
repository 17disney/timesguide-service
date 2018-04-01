'use strict'

const Controller = require('egg').Controller

class TimesguideController extends Controller {
  async list() {
    const { ctx } = this
    // console.log(ctx.model)
    const list = await ctx.model.Timesguide.findAll()
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
