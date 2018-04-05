const Controller = require('egg').Controller
const crypto = require('crypto')

class userController extends Controller {
  async login() {
    const { ctx, app } = this
    const loginService = app.weapp.LoginService.create(
      ctx.request,
      ctx.response
    )

    const data = await loginService.login()
    const userInfo = data.userInfo
    const user = await ctx.service.user.getOauthUser(userInfo, 'WEAPP')

    // const managers = await ctx.model.models.school_managers.findAll({
    //   attributes: { exclude: ['createdAt', 'updatedAt'] },
    //   where: {
    //     userId: user.id
    //   }
    // })
    data.userInfo = Object.assign(
      {
        // id: user.id,
        name: user.name,
        avatar: user.avatar,
        level: user.level,
        userid: user.userid
        // inChargeOf: managers.map(item => item.schoolId)
      },
      data.userInfo
    )
    ctx.body = data
  }

  async timesguides() {
    const { ctx } = this
    const { userid } = ctx.params

    const list = await ctx.model.Exchange.findAll({
      where: {
        userid
      },
      include: [
        {
          model: ctx.model.Timesguide,
          as: 'tidInfo'
          // attributes: ['picUrl', 'startDate', 'endDate']
        },
        {
          model: ctx.model.Timesguide,
          as: 'targetTidInfo'
          // attributes: ['picUrl', 'startDate', 'endDate']
        }
      ],

      order: [['created_at', 'DESC']]
    })
    ctx.body = list
  }

  async contributes() {
    const { ctx } = this
    const { userid } = ctx.params

    const list = await ctx.model.Contribute.findAll({
      where: {
        userid
      },
      order: [['created_at', 'DESC']]
    })
    ctx.body = list
  }

  async starteds() {
    const { ctx } = this
    const { userid } = ctx.params

    const list = await ctx.model.Started.findAll({
      where: {
        userid
      },
      order: [['created_at', 'DESC']]
    })
    ctx.body = list
  }

  async messages() {
    const { ctx } = this
    const { userid } = ctx.params

    const list = await ctx.model.Message.findAll({
      where: {
        userid
      },
      order: [['created_at', 'DESC']]
    })
    ctx.body = list
  }

  async info() {
    const { ctx } = this
    const { userid } = ctx.params
    ctx.body = await ctx.service.user.getUserinfo(userid)
  }

  async user() {
    const { ctx } = this
    const { userid } = ctx.params

    const user = await ctx.service.user.checkWeappUser()
    ctx.body = await ctx.service.user.getUserinfo(user.id)
  }

  async cos_auth() {
    const config = this.app.config.cos
    let folder = config.folder || ''
    if (folder && folder.indexOf('/') === 0) {
      folder = folder.substr(folder.indexOf('/') + 1)
    }

    const { appId, bucket, secretId, secretKey } = config
    const expiredTime = 0 // 单次签名，e 必须设置为0；多次有效签名时，e 为签名的时间戳，单位是秒
    const currentTime = parseInt(Date.now() / 1000) // 当前时间戳，是一个符合 Unix Epoch 时间戳规范的数值，单位为秒
    const rand = parseInt(Math.random() * Math.pow(2, 32)) // 随机串，无符号10进制整数，用户需自行生成，最长 10 位
    const fileId = encodeURIComponent(`/${appId}/${bucket}/${folder}`) // 唯一标识存储资源的相对路径。格式为 /appId/bucketname/dirname/[filename]

    // 每个字段具体格式查看文档：https://www.qcloud.com/document/product/436/6054
    const plainText = `a=${appId}&k=${secretId}&e=${expiredTime}&t=${currentTime}&r=${rand}&f=${fileId}&b=${bucket}`
    const data = new Buffer(plainText, 'utf8')
    const resStr = crypto
      .createHmac('sha1', secretKey)
      .update(data)
      .digest()
    const bin = Buffer.concat([resStr, data])
    const sign = bin.toString('base64')
    this.ctx.body = sign
  }
}

module.exports = userController
