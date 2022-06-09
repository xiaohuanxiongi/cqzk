import { addNotification } from '../../utils/wxNotification';
import { cloud } from "../../utils/request";

Page({
  data: {
    loading: true,
    info: {},
    auth: false,
    list: []
  },
  onLoad() {
    this.checkAuth();
  },
  async checkAuth() {
    try {
      await cloud('cqzk', 'checkAuth');
      this.setData({ auth: true }, () => {
        this.getList()
      });
    } catch (err) {
      console.log(err);
      this.setData({ auth: false, loading: false });
    }
  },
  async getList() {
    try {
      const { zyKcList, zy } = await cloud('cqzk', 'bykc');
      this.setData({ list: zyKcList, info: zy, loading: false })
    } catch (err) {
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    }
  }
})

