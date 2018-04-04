const Service = require('egg').Service
const uuid = require('../utils/uuid')

class UserService extends Service {
  constructor(ctx) {
    super(ctx)
    this.models = this.ctx.model
  }

  // 检查登录
  async checkWeappUser() {
    const { app, request, response } = this.ctx
    const loginService = app.weapp.LoginService.create(request, response)
    const weapp_user = await loginService.check()

    const user = await this.getOauthUser(weapp_user.userInfo)

    const Info = Object.assign(
      {
        name: user.name,
        avatar: user.avatar,
        level: user.level,
        id: user.id
      },
      weapp_user.userInfo
    )

    return Info
  }

  // oauth 获取用户
  async getOauthUser(userInfo, site = 'WEAPP') {
    const oauth_user = await this.models.SocialOauth.findOne({
      where: {
        site_uid: userInfo.openId
      }
    })

    // 无用户则创建
    if (!oauth_user) {
      userInfo.id = uuid()

      const user = await this.createUser(site, userInfo)
      return user
    }

    // 读取用户资料
    const user = await this.models.User.findOne({
      attributes: ['name', 'avatar', 'level'],
      where: {
        id: oauth_user.userid
      }
    })

    user.oauth = oauth_user
    user.id = oauth_user.userid
    return user
  }

  async getUserinfo(userid) {
    const user = await this.models.User.findOne({
      where: {
        id: userid
      }
    })

    const userprofile = await this.models.Userprofile.findOne({
      where: {
        userid
      }
    })

    let { sex, city, province, country, aboutMe, birthday } = userprofile
    let { id, name, avatar } = user

    const User = {
      id,
      name,
      avatar,
      sex,
      city,
      province,
      country,
      aboutMe,
      birthday
    }

    return User
  }

  async createUser(site, userInfo) {
    // const userid = uuid()
    const user = await this.models.User.create({
      name: userInfo.nickName,
      avatar: userInfo.avatarUrl,
      id: userInfo.id
    })

    const oauth = await this.models.SocialOauth.create({
      site,
      site_uid: userInfo.openId,
      site_uname: userInfo.nickName,
      unionid: userInfo.unionId,
      userid: userInfo.id
    })

    await this.models.Userprofile.create({
      sex: userInfo.gender,
      city: userInfo.city,
      province: userInfo.province,
      country: userInfo.country,
      userid: userInfo.id
    })
    user.oauth = oauth
    return user
  }
}

module.exports = UserService
