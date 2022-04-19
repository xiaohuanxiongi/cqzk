const axios = require('axios');
const { zkUrl } = require('./api/index');
const codeUrl = [zkUrl];

const service = axios.create({

});

service.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});

//  响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (codeUrl.includes(response.config.url)) {
      return Promise.resolve(response)
    } else if (response.status === 200) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res)
    }
  }, error => {
    console.log('请求失败', error)
  }
);

module.exports = service;
