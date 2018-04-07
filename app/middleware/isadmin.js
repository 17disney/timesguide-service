const { ERROR_CODE } = require('../utils/const')

module.exports = () => {
  return async function(ctx, next) {
    const { adminid, password } = ctx.request.body
    const user = await ctx.model.User.findOne({
      where: {
        id: adminid,
        password
      }
    })
    if (!user) {
      ctx.body = { message: '没有权限', errcode: ERROR_CODE.SEESION_FAIL }
      return
    }

    await next()
  }
}
