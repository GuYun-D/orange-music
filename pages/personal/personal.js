import request from '../../utils/request'
let startY = 0 // 手指起始坐标
let moveY = 0 // 手指移动实时坐标
let moveDistance = 0 // 手指移动的距离

Page({
  data: {
    transformYNum: "translate(0)",
    transitionNum: "",
    userInfo: {},
    recentPlay: []
  },

  handleTouchStart(event) {
    startY = event.touches[0].clientY
    this.setData({
      transitionNum: ""
    })
  },

  handleTouchMove(event) {
    moveY = event.touches[0].clientY
    // 计算手指移动的距离
    moveDistance = moveY - startY
    if (moveDistance < 0) {
      return
    }
    if (moveDistance >= 80) {
      moveDistance = 80
    }
    this.setData({
      transformYNum: `translateY(${moveDistance}rpx)`
    })
  },

  toLogin() {
    if (this.data.userInfo.nickname) {
      return;
    }
    wx.navigateTo({
      url: '/pages/loign/login',
    })
  },

  handleTouchEnd() {
    this.setData({
      transformYNum: 'translateY(0rpx)',
      transitionNum: "transform 350ms linear"
    })
  },
  onLoad: function (options) {
    // 获取本地用户信息
    let userInfo = wx.getStorageSync('userInfo')

    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })

      // 获取用户的播放记录
      this.getUserRencet(this.data.userInfo.userId)
    }
  },

  // 获取用户播放记录
  async getUserRencet(userId) {
    let recordResult = await request('user/record', {
      uid: userId,
      type: 0
    })

    let recentPlayList = recordResult.allData.slice(0, 10).map((item, index) => {
      item.id = index++
      return item
    })
    this.setData({
      recentPlay: recentPlayList
    })
  },

  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})