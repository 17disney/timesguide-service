const Controller = require('egg').Controller
const pkg = require('../../package.json')

class HomeController extends Controller {
  async index() {
    const { ctx } = this
    // await ctx.model.User.sync({ force: true })
    // await ctx.model.Userprofile.sync({ force: true })
    // await ctx.model.SocialOauth.sync({ force: true })

    // await ctx.model.Message.sync({ force: true })
    // await ctx.model.Timesguide.sync({ force: true })
    // await ctx.model.TimesguideChildren.sync({ force: true })
    // await ctx.model.Exchange.sync({ force: true })
    // await ctx.model.Contribute.sync({ force: true })
    const { name, version } = pkg
    ctx.body = { name, version }
  }
}

module.exports = HomeController
