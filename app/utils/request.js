const fetch = function(url, options = {}) {
  const { method = 'GET', body = {} } = options

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: body,
      method,
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (showError) {
          if (res.statusCode < 200 || res.statusCode > 300) {
            return reject(res.data || {})
          }

          if (Number(res.data.status) !== 0) {
            return reject(res.data || {})
          }
        }

        return resolve(res.data || {})
      },
      complete: res => {
        // TODO:
      }
    })
  })
}

export default fetch
