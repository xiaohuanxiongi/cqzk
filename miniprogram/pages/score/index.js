import { toast } from '../../utils/util';
Page({
  data: {
    list: [],
    index: 0,
    info: [],
    isShow: false,
    msg: '请选择月份查询'
  },
  onLoad() {
    this.getList();
  },

  //  获取可查月份
  getList() {
    wx.cloud.callFunction({ name: 'cqzk', data: { type: 'title' } }).then((res) => {
      const list = res.result.data;
      this.setData({ list })
      console.log(res)
    }).catch((err) => {
      toast('失败');
      console.log(err)
    })
  },
  //  修改
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  //  获取成绩
  getInfo(e) {
    wx.showLoading({ title: '请稍后..' });
    const codeId = this.data.list[this.data.index]['code'];
    wx.cloud.callFunction({
      name: 'cqzk',
      data: { type: 'cj', code: codeId }
    }).then((res) => {
      toast('成功');
      if (res.result.code === 200) {
        this.setData({
          isShow: true,
          info: res.result.data
        })
      } else {
        this.setData({
          isShow: false,
          msg: res.result.msg
        })
      }
    }).catch((err) => {
      toast('失败');
      console.log(err)
    })
  }
})
