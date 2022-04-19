//  自考
const zkUrl = 'http://zk.cqksy.cn/zkkslogin/defaultKaptcha'
//  识别验证码
const base64Img = 'https://service-3fioxazu-1257340589.gz.apigw.tencentcs.com/release/base64img'
//  登录自考
const zkLoginUrl = 'http://zk.cqksy.cn/zkkslogin/login'
//  获取信息/验证token
const zkInfoUrl = 'http://zk.cqksy.cn/zkksquery/kj/getKsInfo'
//  获取考试id
const titleUrl = 'http://zk.cqksy.cn/zkksquery/getTkList';
//  获取成绩
const scoreUrl = 'http://zk.cqksy.cn/zkksquery/kj/getTkCj';
//  毕业预判
const byKc = 'http://zk.cqksy.cn/zkksby/getByKc'

module.exports = {
  zkUrl,
  base64Img,
  zkLoginUrl,
  zkInfoUrl,
  titleUrl,
  scoreUrl,
  byKc
}
