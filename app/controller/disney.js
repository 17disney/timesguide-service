const Controller = require('egg').Controller

class DisneyController extends Controller {
  async friends() {
    const { ctx } = this
    ctx.body = await ctx.service.disney.getAll()
  }
}

module.exports = DisneyController
