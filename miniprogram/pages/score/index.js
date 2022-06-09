import { hex_md5 } from '../../assets/lib/md5';
import { toast } from '../../utils/util';
import { cloud } from "../../utils/request";

Page({
  data: {
    auth: false,
    loading: true,
    list: [],
    index: 0,
    info: [],
    isShow: false,
    msg: '请选择月份查询'
  },
  onLoad() {
    this.getList();
    this.checkUser();
  },
  //  验证账号是否授权过,若未授权则是输入账号密码查询,若授权过则可以直接查询
  async checkUser() {
    try {
      await cloud('cqzk', 'checkAuth');
      this.setData({ auth: true });
    } catch (err) {
      this.setData({ auth: false });
    }
  },
  //  获取可查月份
  getList() {
    wx.cloud.callFunction({ name: 'cqzk', data: { type: 'title' } }).then((res) => {
      const list = res.result.data;
      this.setData({ list, loading: false });
    }).catch((err) => {
      toast('失败');
      this.setData({ loading: false });
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
    wx.showLoading({ title: '查询中..' });
    const codeId = this.data.list[this.data.index]['code'];
    if (this.data.auth) {
      cloud('cqzk', 'cj', { code: codeId }).then(res => {
        wx.hideLoading();
        this.setData({ isShow: true, info: res });
      }).catch(err => {
        wx.hideLoading();
        this.setData({ isShow: false, msg: err });
      })
    } else {
      let { zjhm, mm } = e.detail.value;
      if (zjhm && mm) {
        mm = hex_md5(mm);
        cloud('cqzk', 'cj', { code: codeId, zjhm, mm }).then(res => {
          wx.hideLoading();
          this.setData({ isShow: true, info: res });
        }).catch(err => {
          wx.hideLoading();
          this.setData({ isShow: false, msg: err });
        })
      } else {
        toast(`请填写完整信息`);
      }
      // wx.hideLoading()
    }
  }
})
