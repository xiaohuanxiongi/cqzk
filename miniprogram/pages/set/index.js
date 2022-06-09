import { cloud } from "../../utils/request";
import {toast} from "../../utils/util";

Page({
  data: {
    auth: false,
    loading: true,
    index: 0,
    isClick: false,
    screenings: {}
  },
  onLoad() {
    this.checkAuth();
  },
  async checkAuth() {
    try {
      const { isQuery } = await cloud('cqzk', 'checkAuth');
      this.setData({ auth: true, isClick: isQuery }, () => {
        this.getList()
      });
    } catch (err) {
      console.log(err);
      this.setData({ auth: false, loading: false });
    }
  },
  async getList() {
    try {
      const data = await cloud('cqzk', 'title');
      this.setData({ screenings: data[0], loading: false });
      // const curTime = this.formateDate(new Date(), 'yyyy-MM').split('-').join('');
      // const list = data.filter(v => {
      //   const time = v.name.match(/\d+/g);
      //   time[1] = time[1] > 10 ? time[1] : '0' + time[1];
      //   return time.join('') >= curTime
      // });
      // this.setData({
      //   screenings: list.length > 1 ? list[1] : list[0]
      // })
    } catch (err) {
      console.log(err)
    }
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  handleSubmit(e) {
    const that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['5VOjftjf0dTEx-UEvbMh-1pZhZQ_6KSBXB0HirJwjqY'],
      success (res) {
        if(res['5VOjftjf0dTEx-UEvbMh-1pZhZQ_6KSBXB0HirJwjqY'] === 'accept') {
          cloud('cqzk', 'subscribe', { code: that.data.screenings.code }).then(res => {
            toast(`订阅成功`);
            that.setData({ isClick: true });
          }).catch(err => {
            console.log(err);
          })
        }
      }
    })
  },
  formateDate(date, rule) {
    let fmt = rule || 'yyyy-MM-dd'
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear())
    }
    const o = {
      // 'y+': date.getFullYear(),
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const val = o[k] + '';
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length));
      }
    }
    return fmt;
  }
})
