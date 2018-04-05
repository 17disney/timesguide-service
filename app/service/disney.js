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

  async getAll() {
    const { ctx } = this
    const data = []

    firendList.forEach(item => {
      const { id, name, media } = item
      const create = {
        id,
        name,
        avatar: media.avatarMobileSquare['url'],
        level: 99
      }

      data.push(create)

      // ctx.model.User.create(create)
    })

    return data
  }
}

module.exports = DisneyFriendService
