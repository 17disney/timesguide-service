const firendList = require('../vendor/disney/disney-firend')
const Service = require('egg').Service

class DisneyFriendService extends Service {
  // 获得随机朋友
  async getRandom() {
    const vid = Math.round(Math.random() * 55)
    const data = firendList[vid]
    const { id, name, media } = data

    const nData = {
      id,
      name,
      avatarUrl: media.avatarMobileSquare['url']
    }
    return nData
  }
}

module.exports = DisneyFriendService
