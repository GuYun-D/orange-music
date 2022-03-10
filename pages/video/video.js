import request from '../../utils/request'
Page({
  data: {
    navList: [],
    navId: ""
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
  },

  // 点击修改id
  chnageNav(event) {
   let navId = event.currentTarget.id
    this.setData({
      navId
    })
  }
})