'use strict'
const qiniu = require('qiniu')
const Controller = require('egg').Controller

class UploadController extends Controller {
  async token() {
    const { app } = this

    const accessKey = app.config.qiniu.accessKey
    const secretKey = app.config.qiniu.secretKey
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

    const options = {
      scope: app.config.qiniu.bucket
    }

    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(mac)

    this.ctx.body = { uploadToken }
  }
}

module.exports = UploadController
