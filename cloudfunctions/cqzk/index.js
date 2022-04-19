// 云函数入口文件
const cloud = require('wx-server-sdk')
const check = require('./check/index');
const getTitle = require('./getTitle/index');
const subscribe = require('./subscribe/index');
const bykc = require('./by/index');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const openId = cloud.getWXContext().OPENID;
  switch (event.type) {
    case 'add':
      const { zjhm, mm, code:codeId } = event;
      const params = { zjhm, mm, openId, codeId };
      return await check.main(params);
    case 'title':
      return await getTitle.main();
    case 'subscribe':
      return await subscribe.main({ openId });
    case 'bykc':
      return await bykc.main({ openId });
  }
}
