import request from '../../utils/request'

Page({
  data: {
    isPlay: false,
    musicInfo: {}
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

    this.getSongInfo(id)
  },

  async getSongInfo(id) {
    const musicInfo = await request('song/detail', {
      ids: id
    })

    this.setData({
      musicInfo: musicInfo.songs[0]
    })
  },

  handleMusicPlay() {
    let {
      isPlay
    } = this.data
    this.setData({
      isPlay: !isPlay
    })
  }
})