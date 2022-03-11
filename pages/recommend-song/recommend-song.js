// pages/recommend-song/recommend-song.js
Page({
  data: {
    day: 0,
    month: 0
  },
  onLoad: function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
  },
})