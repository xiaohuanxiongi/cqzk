const { getNews } = require('../service');

exports.main = async (event) => {
  // const { openId } = event;
  try {
    const news = await getNews();
    return { code: 200, data: news };
  } catch (err) {
    return { code: 400, msg: '获取信息失败' };
  }
}
