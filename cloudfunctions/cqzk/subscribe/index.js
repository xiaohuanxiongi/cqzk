const { editMore } = require('../collection/index');

exports.main = async (event) => {
  const { openId, code } = event;
  return new Promise((resolve, reject) => {
    editMore('user', { openId }, { code, isQuery: true }).then(() => {
      resolve({ code: 200, msg: '订阅消息成功'});
    }).catch(err => {
      reject({ code: 400, msg: '订阅失败,请重试' })
    });
  })

}
