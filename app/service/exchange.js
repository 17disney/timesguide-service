const Service = require('egg').Service

class ExchangeService extends Service {
  async create() {

    // const data = await this.models.Exchange.create({
    //   site,
    //   site_uid: userInfo.openId,
    //   site_uname: userInfo.nickName,
    //   unionid: userInfo.unionId,
    //   userid
    // })

    return data

  }

  async checkGiveAvailable(tid, userid) {
    const { ctx } = this
    const exchangeCount = await ctx.model.Exchange.count({
      where: {
        userid,
        tid,
        targetTid: null
      }
    })
    const available = MAX_GIVE - exchangeCount
    return available
  }

}

module.exports = ExchangeService
