// 云函数入口文件
const query = require('./query/index');

// 云函数入口函数
exports.main = async (event, context) => {
  return await query.main(event, context);
}
