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
          selected: 1
        })
      }
    }
  },
})
