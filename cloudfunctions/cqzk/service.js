const axios = require('./axios');
const { zkUrl, base64Img, zkLoginUrl, zkInfoUrl, titleUrl, scoreUrl } = require('./api');
const qs = require('qs');

//  自考获取验证码
function zkCodeService(params) {
  return axios.get(zkUrl, { params, responseType: "arraybuffer" })
}

//  识别验证码
function base64ImgService(data) {
  return axios.post(base64Img, qs.stringify(data))
}

//  登录
function zkLoginService(data, cookie) {
  return axios.post(zkLoginUrl, data, { headers: { Cookie: cookie } })
}

//  获取用户信息/验证token
function zkTokenCheckService(cookie) {
  return axios.get(zkInfoUrl, { headers: { Cookie: cookie } })
}

//  获取考试目录信息
function zkTitleService(params) {
  return axios.get(titleUrl, { params })
}

//  获取成绩
function zkScoreService(params, cookie) {
  return axios.get(`${scoreUrl}/${params.id}`, { params, headers: { Cookie: cookie } })
}

module.exports = {
  zkCodeService,
  base64ImgService,
  zkLoginService,
  zkTokenCheckService,
  zkTitleService,
  zkScoreService
}
