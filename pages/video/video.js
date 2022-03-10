import request from '../../utils/request'
Page({
  data: {
    navList: [],
    navId: "",
    videoLiSt: []
  },
  onLoad: function (options) {
    this.getNavList()
  },

  async getNavList() {
    const navResult = await request('video/group/list')
    this.setData({
      navList: navResult.data.slice(0, 14),
      navId: navResult.data[0].id
    })
    this.getVideoList(navResult.data[0].id)
  },

  // 点击修改id
  chnageNav(event) {
    let navId = event.currentTarget.id
    this.setData({
      navId: navId,
      videoLiSt: []
    })
    this.getVideoList(navId)
  },

  // 获取视频信息
  async getVideoList(navId) {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    const videoListResult = await request('video/group', {
      id: navId
    })
    let index = 0
    this.setData({
      videoLiSt: videoListResult.datas.map(item => {
        item.id = index++
        return item
      })
    })

    wx.hideLoading()
  },
})