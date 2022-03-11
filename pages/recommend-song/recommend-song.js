import request from '../../utils/request'

Page({
  data: {
    day: 0,
    month: 0,
    recommendList: []
  },
  onLoad: function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })

    this.getRecommendList()
  },

  async getRecommendList() {
    const recommendResult = await request('recommend/songs')

    this.setData({
      recommendList: recommendResult.recommend
    })
  },

  toSongDetail(event) {
    let songId = event.currentTarget.dataset.song.id.toString()
    wx.navigateTo({
      url: '/pages/song-detail/song-detail?id=' + songId,
    })
  }
})