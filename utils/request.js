import config from './config'
// 封装ajax
export default function (url, data, method = "GET", cb) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header: {
        cookie: (wx.getStorageSync('cookies') || []).find(item => item.indexOf('MUSIC_U') !== -1) || ''
      },
      success: (result) => {
        // 登陆成功，将cookie保存到本地
        try {
          if (data.isLogin) {
            wx.setStorageSync('cookies', result.cookies)
          }
        } catch (error) {

        }
        resolve(result.data)
      },
      fail: (errorMsg) => {
        console.log(errorMsg);
        reject(errorMsg)
      },
      complete: () => {
        cb && typeof cb === "function" && cb()
      }
    })
  })
}