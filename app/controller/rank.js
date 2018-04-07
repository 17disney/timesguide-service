const Controller = require('egg').Controller

class RankController extends Controller {
  async list() {
    const { ctx } = this
    
    const data =  await ctx.model.User.findAll({
      where: {
        level: 0
      },
      attributes: ['id', 'name', 'avatar', 'mark'],
      order: [['mark', 'DESC']],
      limit: 20
    })

    ctx.body = data
  }
}

module.exports = RankController
