/**
 * 封装云端请求
 */

export function cloud(name, type, data ) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data: { type, ...data }
    }).then((res) => {
      if (res.result.code === 200) {
        resolve(res.result.data);
      } else {
        reject(res.result.msg);
      }
    }).catch((err) => {
      reject(err);
    })
  })
}
