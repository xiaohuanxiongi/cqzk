Page({
  data: {
    date: '',
    list: [],
    index: 0,
    isClick: false
  },
  onLoad() {
    this.getList();
    this.setData({
      date: this.formateDate(new Date())
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
  },
  getList() {
    wx.cloud.callFunction({
      name: 'cqzk',
      data: { type: 'title' }
    }).then(res => {
      this.setData({
        list: res.result.data,
        isClick: true
      })
    })
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
    this.setData({
      isClick: false
    }, () => {
      const { index, time } = e.detail.value;
      const codeId = this.data.list[index]['code'];
      const date = time.replace(new RegExp("-","gm"),"/");
      const newTime = (new Date(date + ' 09:00:00')).getTime();
      wx.cloud.callFunction({
        name: 'cqzk',
        data: { type: 'set', codeId, time: newTime }
      }).then(res => {
        wx.showToast({ title: '设置成功', icon: 'none' });
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.setData({ isClick: true })
      })
    })
  }
})
