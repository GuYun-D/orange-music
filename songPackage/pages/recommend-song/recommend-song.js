import PubSub from 'pubsub-js'
import request from '../../../utils/request'

Page({
  data: {
    day: 0,
    month: 0,
    recommendList: [],
    currentMusicIndex: 0
  },
  onLoad: function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })

    this.getRecommendList()

    // 订阅消息
    PubSub.subscribe("switchType", (msg, type) => {
      let {
        recommendList,
        currentMusicIndex
      } = this.data
      if (type === "pre") {
        (currentMusicIndex === 0) && (currentMusicIndex = recommendList.length)
        currentMusicIndex -= 1
      } else {
        (currentMusicIndex === recommendList.length - 1) && (currentMusicIndex = -1)
        currentMusicIndex += 1
      }
      this.setData({
        currentMusicIndex
      })
      let musicId = recommendList[currentMusicIndex].id
      PubSub.publish("musicId", musicId)
    })
  },

  async getRecommendList() {
    const recommendResult = await request('recommend/songs')

    this.setData({
      recommendList: recommendResult.recommend
    })
  },

  toSongDetail(event) {
    let songId = event.currentTarget.dataset.song.id.toString()
    let index = event.currentTarget.dataset.index
    this.setData({
      currentMusicIndex: index
    })
    wx.navigateTo({
      url: '/songPackage/pages/song-detail/song-detail?id=' + songId,
    })
  }
})