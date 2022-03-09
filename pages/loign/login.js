import request from "../../utils/request"

Page({
  data: {
    phone: "",
    password: ""
  },

  // 收集表单数据
  handleInput(event) {
    let type = event.currentTarget.id
    this.setData({
      [type]: event.detail.value
    })
  },

  // 登录
  async login() {
    let {
      password,
      phone
    } = this.data
    // 前端验证
    if (!phone.trim()) {
      wx.showToast({
        title: '用户名不能为空',
        icon: "error"
      })
      return;
    }

    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'error'
      })

      return;
    }

    if (!password.trim()) {
      wx.showToast({
        title: '密码不能为空',
      })

      return;
    }

    try {
      // 后端验证
      let loginRes = await request('login/cellphone', {
        phone,
        password
      })

      if (loginRes.code === 200) {
        wx.showToast({
          title: '登陆成功',
          icon: "success"
        })

        // 将用户信息存入本地
        wx.setStorageSync("userInfo", loginRes.profile)

        wx.reLaunch({
          url: '/pages/personal/personal',
        })
      } else if (loginRes.code === 501) {
        wx.showToast({
          title: '用户不存在',
          icon: "error"
        })
      } else if (loginRes.code === 502) {
        wx.showToast({
          title: '密码错误',
          icon: "error"
        })
      } else {
        wx.showToast({
          title: '登陆失败，请重新登陆',
          icon: "none"
        })
      }
    } catch (error) {
      console.log(error);
    }
  },

  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})