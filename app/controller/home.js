'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    const {ctx} = this
    
    await ctx.model.Timesguide.sync({ force: true })
    await ctx.model.Exchange.sync({ force: true })

    ctx.body = 'hi, egg'

  }
}

module.exports = HomeController
