const firendList = require('../vendor/disney/disney-firend')
const Service = require('egg').Service
const { getRandomList } = require('../utils')

class DisneyFriendService extends Service {
  // 获得随机朋友
  async getRandom(num = 1) {
    let randomList = getRandomList(num, 55)
    let users = []

    randomList.forEach(key => {
      const { id, name, media } = firendList[key]
      users.push({
        id,
        name,
        avatar: media.avatarMobileSquare['url']
      })
    })

    if (num > 1) {
      return users
    } else {
      return users[0]
    }
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
