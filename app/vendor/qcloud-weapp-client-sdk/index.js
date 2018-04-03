import constants from './lib/constants'
import login from './lib/login'
import Session from './lib/session'
import request from './lib/request'

const exports = {
  login: login.login,
  setLoginUrl: login.setLoginUrl,
  LoginError: login.LoginError,
  clearSession: Session.clear,
  request: request.request,
  RequestError: request.RequestError
}

// 导出错误类型码
Object.keys(constants).forEach(key => {
  if (key.indexOf('ERR_') === 0) {
    exports[key] = constants[key]
  }
})

export default exports
