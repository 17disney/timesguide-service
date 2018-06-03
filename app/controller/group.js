const Controller = require('egg').Controller

class GroupController extends Controller {
  async list() {
    const { ctx } = this
    ctx.body = await ctx.service.disney.getAll()
  }
}

module.exports = GroupController
