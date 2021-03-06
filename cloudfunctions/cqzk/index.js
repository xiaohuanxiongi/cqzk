// 云函数入口文件
const { readOne } = require('./collection/index');
const cloud = require('wx-server-sdk')
const check = require('./check/index');
const getTitle = require('./getTitle/index');
const subscribe = require('./subscribe/index');
const bykc = require('./by/index');
const score = require('./score/index');
const setInfo = require('./setInfo/index');
const news = require('./news/index');
const checkAuth = require('./checkAuth/index');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const openId = cloud.getWXContext().OPENID;
  // console.log(event, context, openId);
  switch (event.type) {
    case 'user':
      return { openId };
    case 'add':
      const { zjhm, mm } = event;
      // const info = await readOne('date', 'queryInfo');
      // const codeId = info.data.codeId;
      const params = { zjhm, mm, openId };
      return await check.main(params);
    case 'title':
      return await getTitle.main();
    case 'subscribe':
      return await subscribe.main({ openId, ...event });
    case 'bykc':
      return await bykc.main({ openId });
    case 'cj':
      return await score.main({ ...event, openId });
    case 'set':
      return await setInfo.main({ ...event });
    case 'news':  //  获取新闻
      return await news.main();
    case 'checkAuth': //  验证用户是否授权
      return await checkAuth.main({ openId });
  }
}
