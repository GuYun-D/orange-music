let startY = 0 // 手指起始坐标
let moveY = 0 // 手指移动实时坐标
let moveDistance = 0 // 手指移动的距离

Page({
  data: {
    transformYNum: "translate(0)",
    transitionNum: ""
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
    
    if(moveDistance < 0){
      return
    }

    if(moveDistance >= 80){
      moveDistance = 80
    }

    this.setData({
      transformYNum: `translateY(${moveDistance}rpx)`
    })
  },

  handleTouchEnd() {
    this.setData({
      transformYNum: 'translateY(0rpx)',
      transitionNum: "transform 350ms linear"
    })
  },
  onLoad: function (options) {

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