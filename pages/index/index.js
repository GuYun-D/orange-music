import request from '../../utils/request'

const app = getApp()
Page({
  data: {
    banners: [], /// 轮播图
    recommendList: [], // 推荐
    topList: [], // 排行榜 
  },
  onLoad() {
    this.getInitData()
  },

  async getInitData() {
    const {
      banners
    } = await request('banner', {
      type: 2
    })
    this.setData({
      banners: banners
    })
    const {
      result
    } = await request('personalized')
    this.setData({
      recommendList: result
    })

    // 获取排行榜的数据
    let idx = 0
    let resultTopArr = []
    while (idx < 5) {
      const
        res = await request('top/list', {
          idx: idx++
        })

      resultTopArr.push({
        name: res.playlist.name,
        tracks: res.playlist.tracks
      })

      this.setData({
        topList: resultTopArr
      })
    }
  },

  toRecommendSong(){
    wx.navigateTo({
      url: '/songPackage/pages/recommend-song/recommend-song',
    })
  }
})