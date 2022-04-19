const { hex_md5 } = require('../../assets/lib/md5');
import { postNotificationName } from '../../util/wxNotification';
Page({
  data: {
    array: [],
    index: 1
  },
  onLoad() {
    this.getList();
  },
  clickInfo() {
    wx.requestSubscribeMessage({
      tmplIds: ['5VOjftjf0dTEx-UEvbMh-1pZhZQ_6KSBXB0HirJwjqY'],
      success (res) {
        if(res['5VOjftjf0dTEx-UEvbMh-1pZhZQ_6KSBXB0HirJwjqY'] === 'accept') {
          wx.cloud.callFunction({
            name: 'cqzk',
            data: { type: 'subscribe' }
          })
          wx.showToast({
            title: '已成功订阅~',
            icon: 'none'
          })
        }
      }
    })
  },
  async formSubmit(e) {
    wx.showLoading({
      title: '验证中',
    });
    let { zjhm, mm } = e.detail.value;
    if (zjhm && mm) {
      try {
        mm = hex_md5(mm)
        const codeId = this.data.array[this.data.index]['code'];
        const params = { type: 'add', zjhm, mm, code: codeId };
        wx.cloud.callFunction({
          name: 'cqzk',
          data: params
        }).then(resp => {
          const res = resp.result;
          wx.showToast({ title: res.msg, icon: 'none' });
          postNotificationName('isAuth', true);
        }).catch(err => {
          wx.showToast({ title: `请求超时` });
        })
      } catch (err) {
        wx.showToast({ title: `出错` });
      }
    } else {
      wx.showToast({ title: `请填写信息`, icon: 'none' });
    }
  },
  getList() {
    wx.cloud.callFunction({
      name: 'cqzk',
      data: { type: 'title' }
    }).then(res => {
      this.setData({
        array: res.result.data
      })
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e)
    this.setData({
      index: e.detail.value
    })
  }
})
