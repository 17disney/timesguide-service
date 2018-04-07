const { ERROR_CODE } = require('../utils/const')

module.exports = () => {
  return async function (ctx, next) {
    const user = await ctx.service.user.checkWeappUser()
    if (!user) {
      ctx.body = { message: '登录已失效', errcode: ERROR_CODE.SEESION_FAIL }
      return
    }
    ctx.user = user
    await next()
  }
}
