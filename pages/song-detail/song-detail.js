import request from '../../utils/request'

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
    this.setData({
      isPlay: !isPlay
    })

    this.musicControl(!isPlay, this.data.currrentMusicId)
  },

  // 控制音乐的播放
  async musicControl(isPlay, musicId) {
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    if (isPlay) {
      // 获取阴郁的播放地址
      const musicPalayData = await request('song/url', {
        id: musicId
      })
      const musicPlayLink = musicPalayData.data[0].url
      //  生成北京音频的实例
      backgroundAudioManager.src = musicPlayLink
      backgroundAudioManager.title = this.data.musicInfo.name
    } else {
      backgroundAudioManager.pause()
    }
  }
})