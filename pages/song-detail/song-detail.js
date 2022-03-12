import request from '../../utils/request'
// 获取全局app实例
const app = getApp()

Page({
  data: {
    isPlay: false,
    musicInfo: {},
    currrentMusicId: 0
  },
  onLoad: function (options) {
    // 接收路由参数 onLoad的自动的参数options：就携带着
    const {
      id
    } = options
    if (!id) {
      wx.showToast({
        title: '歌曲不存在',
        icon: "error"
      })
      return
    }
    this.setData({
      currrentMusicId: id
    })
    this.getSongInfo(id)

    // 判断当前音乐是否在播放
    if (app.globalData.musicId === id && app.globalData.isMusicPlay) {
      // 在播放
      this.setData({
        isPlay: true
      })
      app.globalData.isMusicPlay = true
    }

    // 用户在使用时会通过系统生成的音乐任务栏进行操作，这个操作页面监听不到，所以直接监听音乐的播放，暂停，停止
    this.backgroundAudioManager = wx.getBackgroundAudioManager()

    this.backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay: true
      })
      app.globalData.isMusicPlay = true
      app.globalData.musicId = id
    })

    this.backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false
      })
      app.globalData.isMusicPlay = false
    })

    this.backgroundAudioManager.onStop(() => {
      this.setData({
        isPlay: false
      })
      app.globalData.isMusicPlay = false
    })
  },
  async getSongInfo(id) {
    const musicInfo = await request('song/detail', {
      ids: id
    })
    this.setData({
      musicInfo: musicInfo.songs[0]
    })
    wx.setNavigationBarTitle({
      title: musicInfo.songs[0].al.name,
    })
  },

  handleMusicPlay() {
    let {
      isPlay
    } = this.data

    this.musicControl(!isPlay, this.data.currrentMusicId)
  },

  // 控制音乐的播放
  async musicControl(isPlay, musicId) {
    if (isPlay) {
      // 获取阴郁的播放地址
      const musicPalayData = await request('song/url', {
        id: musicId
      })
      const musicPlayLink = musicPalayData.data[0].url
      //  生成北京音频的实例
      this.backgroundAudioManager.src = musicPlayLink
      this.backgroundAudioManager.title = this.data.musicInfo.name
    } else {
      this.backgroundAudioManager.pause()
    }
  }
})