import { cloud } from '../../utils/request';

Page({
  data: {
    navList: [
      { imgUrl: '../../assets/img/auth.png', name: '授权登录', des: '一键查询无需登录', url: '/pages/auth/index' },
      { imgUrl: '../../assets/img/icon-2.png', name: '成绩查询', des: '在线查询自考成绩', url: '/pages/score/index' },
      { imgUrl: '../../assets/img/icon-3.png', name: '座位查询', des: '查询准考证信息简表', url: '/page/navigate/navigate' },
      { imgUrl: '../../assets/img/icon-4.png', name: '订阅查询', des: '第一时间知晓成绩', url: '/pages/set/index' },
      { imgUrl: '../../assets/img/icon-1.png', name: '毕业预判', des: '院校专业课程构成', url: '/pages/pre/index' }
      // { imgUrl: '../../assets/img/icon-4.png', name: '自助查询', des: '第一时间知晓成绩', url: '/page/navigate/navigate' }
    ]
  },
  getData() {
    cloud('cqzk', 'news').then(res => {
      this.setData({
        htmlSnip: res
      })
    }).catch(err => {
      console.log(err)
    })
  }
})
