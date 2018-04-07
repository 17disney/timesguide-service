module.exports = options => {
  return async function islogin(ctx, next) {
    await next()

    // 后续中间件执行完成后将响应体转换成 gzip

    ctx.body = { message: '登录已失效' }
  }
}
