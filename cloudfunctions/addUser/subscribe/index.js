const { editOne } = require('../collection/index');

exports.main = async (event) => {
  const { openId } = event;
  editOne('user', { openId }, { isQuery: true });
  return { code: 200, msg: '订阅消息成功'};
}
