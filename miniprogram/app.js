// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        traceUser: true,
      });
    }
    this.globalData = {};
    const updateManager = wx.getUpdateManager();
    //  监听向微信后台请求检查更新结果事件
    updateManager.onCheckForUpdate(res => {
      if (res.hasUpdate) console.log(`有新版,可以更新`);
      else console.log(`没有新版`)
    });
    //  监听小程序有版本更新事件
    updateManager.onUpdateReady(res => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好,是否重启应用?',
        success: data => {
          if (data.confirm) {
            // 强制小程序重启并使用新版本
            updateManager.applyUpdate()
          }
        }
      })
    });
    // 监听小程序更新失败事件
    updateManager.onUpdateFailed(() => {
      wx.showToast({
        title: '新版本下载失败',
        icon: 'none'
      })
    });
    this.overShares();
  },
  //  全局分享
  overShares: function () {
    let that = this;
    !function () {
      let PageTmp = Page;
      Page = function (pageConfig) {
        pageConfig = Object.assign({
          onShareAppMessage: function () {
            return {
              title: `重庆市自学考试成绩查询`,
              path: `/pages/index/index`,
              imageUrl: '/assets/img/share.jpg'
            }
          }
        }, pageConfig);
        PageTmp(pageConfig)
      }
    }();
  },
});
