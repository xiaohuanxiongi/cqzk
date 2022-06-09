const { zkTitleService } = require('../service');
const { read } = require('../collection/index');

exports.main = async (event, context) => {
  return new Promise(async (resolve, reject) => {
    zkTitleService().then(res => {
      resolve({ code: 200, data: res });
    }).catch(err => {
      reject({ code: 400, data: err });
    });
  })
}

