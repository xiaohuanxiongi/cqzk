Component({
  data: {
    statusBarHeight: 0,
    navHead: 0,
    barHeight: 0
  },
  pageLifetimes: {
    show() {
      let that = this;
      const { top, height } = wx.getMenuButtonBoundingClientRect();
      const { statusBarHeight } = wx.getSystemInfoSync();
      const navHead = height + (top - statusBarHeight) * 2;
      const barHeight = navHead + statusBarHeight;
      that.setData({
        statusBarHeight,
        navHead,
        barHeight
      })
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
    }
  },
  methods: {
    jump(e) {
      console.log(e)
      const { key } = e.currentTarget.dataset;
      switch (key) {
        case 'login':
          wx.navigateTo({
            url: '/pages/auth/index'
          })
          break;
        case 'years':
          wx.showToast({ title: '功能开发中...', icon: 'none' })
          // wx.navigateTo({
          //   url: '/pages/auth/index'
          // })
          break;
        case 'seat':
          wx.showToast({ title: '功能开发中...', icon: 'none' })
          // wx.navigateTo({
          //   url: '/pages/auth/index'
          // })
          break;
      }
    }
  }
})
