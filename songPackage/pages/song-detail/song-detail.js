import PubSub from "pubsub-js"
import moment from 'moment'
import request from '../../../utils/request'
// 获取全局app实例
const app = getApp()

Page({
  data: {
    isPlay: false,
    musicInfo: {},
    currrentMusicId: 0,
    musicLink: "",
    currentTime: "00:00",
    durationTime: "00:00",
    currentWidth: "0%"
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

    this.backgroundAudioManager.onTimeUpdate(() => {
      this.setData({
        currentTime: moment(this.backgroundAudioManager.currentTime * 1000).format("mm:ss"),
        currentWidth: ((this.backgroundAudioManager.currentTime) / (this.backgroundAudioManager.duration)) * 100 + "%"
      })
    })

    this.backgroundAudioManager.onEnded(() => {
      // 停止播放，切歌
      PubSub.publish("switchType", "next")
      // 还原状态
      this.setData({
        currentTime: "00:00",
        durationTime: "00:00",
        currentWidth: "0%"
      })
    })

    // 订阅
    PubSub.subscribe("musicId", (msg, musicId) => {
      this.getSongInfo(musicId)
      this.setData({
        isPlay: true
      })
      app.globalData.musicId = musicId
      app.globalData.isMusicPlay = true
      this.musicControl(true, musicId)
    })
  },

  async getSongInfo(id) {
    const musicInfo = await request('song/detail', {
      ids: id
    })
    this.setData({
      musicInfo: musicInfo.songs[0],
      durationTime: moment(musicInfo.songs[0].dt).format("mm:ss")
    })
    wx.setNavigationBarTitle({
      title: musicInfo.songs[0].al.name
    })
  },

  handleMusicPlay() {
    let {
      isPlay
    } = this.data

    this.musicControl(!isPlay, this.data.currrentMusicId, this.data.musicLink)
  },

  // 控制音乐的播放
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) {
        // 获取阴郁的播放地址
        const musicPalayData = await request('song/url', {
          id: musicId
        })
        musicLink = musicPalayData.data[0].url
        this.setData({
          musicLink
        })
      }
      //  生成北京音频的实例
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.musicInfo.name
    } else {
      this.backgroundAudioManager.pause()
    }
  },

  // 切歌
  handleSwitchMusic(event) {
    const opId = event.currentTarget.id
    this.backgroundAudioManager.stop()
    // 发布消息
    PubSub.publish("switchType", opId)
  }
})