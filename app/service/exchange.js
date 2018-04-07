const Service = require('egg').Service
const { MAX_GIVE } = require('../utils/const')
const uuid = require('../utils/uuid')

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

  async createTimesguideChild(tid, userid) {
    const { ctx } = this

    // 创建新的时间表入自己
    const timesguideChildren = await ctx.service.timesguide.createChildren(
      tid,
      userid
    )

    // 随机获取赠与人
    const targetInfo = await ctx.service.disney.getRandom()

    // 创建交易记录
    const create = {
      id: uuid(),
      eid: timesguideChildren.id,
      tid,
      userid,
      targetUserid: targetInfo.id,
      isComplate: true
    }
    await ctx.model.Exchange.create(create)

  }
}

module.exports = ExchangeService
