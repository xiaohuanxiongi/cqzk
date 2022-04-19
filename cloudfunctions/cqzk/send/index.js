const cloud = require('wx-server-sdk')
const template = ['5VOjftjf0dTEx-UEvbMh-1pZhZQ_6KSBXB0HirJwjqY'];
function send(info, openId) {
  if(info.length) {
    const item = info[0];
    const data = {
      touser: openId,
      page: 'index',
      lang: 'zh_CN',
      data: {
        thing4: { value: item.kcmc },
        number1: { value: item.cj },
      },
      templateId: template[0]
    }
    cloud.openapi.subscribeMessage.send({
      ...data
    }).then(result => {
      console.log(`发送成功`, result);
    }).catch(err => {
      console.log(`没有发送成功`, err);
    })
  }
}

module.exports = {
  send
}
