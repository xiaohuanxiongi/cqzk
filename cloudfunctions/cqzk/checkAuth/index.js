const { readOne } = require('../collection/index');

exports.main = async (event) => {
  const { openId } = event;
  try {
    const { data } = await readOne('user', openId);
    const isQuery = data.isQuery ? data.isQuery : '';
    return { code: 200, data: { isQuery }, msg: '已绑定账户' };
  } catch (err) {
    return { code: 400, msg: '未绑定账户' };
  }
}
