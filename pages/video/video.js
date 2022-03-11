import request from '../../utils/request'
Page({
  data: {
    navList: [],
    navId: "",
    videoLiSt: [],
    videoId: ""
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

    if (!videoListResult.datas) {
      return;
    }
    
    let index = 0
    this.setData({
      videoLiSt: videoListResult.datas.map(item => {
        item.id = index++
        return item
      })
    })

    wx.hideLoading()
  },

  // 监听视频播放的回调
  handleMusicPlay(event) {
    /**
     *  只允许一个视频播放
     * 关闭的方法：wx.createVideoContext('id',component)
     */
    // 获取视频的id
    let vid = event.currentTarget.id
    //  this.videoContext && this.vid !== vid  && this.videoContext.stop()
    this.vid = vid
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid)
    this.videoContext.play()
  }
})