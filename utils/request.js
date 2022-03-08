import config from './config'
// 封装ajax
export default function (url, data, method = "GET", cb) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      success: (result) => {
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