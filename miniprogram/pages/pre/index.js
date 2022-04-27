import { addNotification } from '../../utils/wxNotification';
Component({
  data: {
    statusBarHeight: 0,
    navHead: 0,
    barHeight: 0,
    auth: false,
    list: []
  },
  lifetimes: {
    ready() {
      const that = this;
      this.getList();
      addNotification('isAuth', that.getList, that);
    },
  },
  pageLifetimes: {
    show() {
      const that = this;
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
  methods: {
    getList(option) {
      let that;
      if(option) {
        that = this.observer;
      } else {
        that = this;
      }
      wx.cloud.callFunction({
        name: 'cqzk',
        data: { type: 'bykc' }
      }).then((res) => {
        if(res.result.code === 200) {
          that.setData({
            auth: true,
            list: res.result.data
          })
          console.log(that.data)
        } else {
          wx.showToast({
            title: res.result.msg,
            icon: 'none'
          })
        }
      }).catch((err) => {
        console.log(err);
      })
    }
  }
})
