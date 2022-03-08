import request from '../../utils/request'

const app = getApp()
Page({
  data: {
    banners: []
  },
  onLoad() {
    this.getInitData()
  },

  async getInitData() {
    const {
      banners
    } = await request('http://localhost:3000/banner', {
      type: 2
    })
    this.setData({
      banners: banners
    })
  }
})