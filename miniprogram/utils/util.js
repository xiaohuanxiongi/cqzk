export const toast = (title, icon = 'none') => {
  wx.showToast({ title, icon })
}
