Component({
  data: {
    statusBarHeight: 0,
    navHead: 0,
    barHeight: 0,
    openId: '',
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
      wx.cloud.callFunction({
        name: 'cqzk',
        data: { type: 'user' }
      }).then(res => {
        that.setData({ openId: res.result.openId });
      }).catch(err => {
        wx.showToast({ title: `出错` });
      })
    }
  },
  methods: {
    jump(e) {
      const { key } = e.currentTarget.dataset;
      switch (key) {
        case 'login':
          wx.navigateTo({
            url: '/pages/auth/index'
          })
          break;
        case 'years':
          // wx.showToast({ title: '功能开发中...', icon: 'none' })
          wx.navigateTo({
            url: '/pages/score/index'
          })
          break;
        case 'seat':
          wx.showToast({ title: '功能开发中...', icon: 'none' })
          // wx.navigateTo({
          //   url: '/pages/auth/index'
          // })
          break;
          //  设置默认查询,哪场考试,预计什么时候开启自动查询
        case 'set':
          wx.navigateTo({
            url: '/pages/set/index'
          })
          break;
      }
    }
  }
})
