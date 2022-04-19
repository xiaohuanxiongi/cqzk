//  查询方法
const cloud = require('wx-server-sdk');
const { read, editOne } = require('../collection/index');
const { send } = require('../send/index');
const dayjs = require('dayjs');
const {
  zkCodeService,
  base64ImgService,
  zkLoginService,
  zkTokenCheckService,
  zkScoreService
} = require('../service');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});


function btoa(string) {
  const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // Regular expression to check formal correctness of base64 encoded strings
    b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
  string = String(string);
  let bitmap, a, b, c,
    result = "",
    i = 0,
    rest = string.length % 3; // To determine the final padding

  for (; i < string.length;) {
    if ((a = string.charCodeAt(i++)) > 255 ||
      (b = string.charCodeAt(i++)) > 255 ||
      (c = string.charCodeAt(i++)) > 255)
      throw new TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");

    bitmap = (a << 16) | (b << 8) | c;
    result += b64.charAt(bitmap >> 18 & 63) + b64.charAt(bitmap >> 12 & 63) +
      b64.charAt(bitmap >> 6 & 63) + b64.charAt(bitmap & 63);
  }

  // If there's need of padding, replace the last 'A's with equal signs
  return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
};

//  授权
async function check({ zjhm, mm, openId }) {
  return new Promise(async (resolve, reject) => {
    try {
      const flow = await zkCodeService({ _: Math.random() });
      const cookie = flow.headers["set-cookie"][0].split(';')[0];
      const base64 = "data:image/png;base64," + btoa(new Uint8Array(flow.data).reduce((data, byte) => data + String.fromCharCode(byte), ""));
      const code = await base64ImgService({ data: base64 });
      const params = { zjhm, mm, vrifyCode: code.data};
      const isLogin = await zkLoginService(params, cookie);
      if (!isLogin) {
        editOne('user', openId, { token: cookie }).then(() => {
          resolve(cookie);
        }).catch(() => {
          //  修改失败
          reject(`修改失败`);
        })
      } else {
        reject(isLogin);
      }
    } catch (err) {
      if(err === "验证码错误") {
        return check({ zjhm, mm, openId });
      } else {
        reject(err);
      }
    }
  })
}

//  获取用户信息(验证token);
let index = 0;
function getInfo(user) {
  const cookie = user.token;
  return new Promise((resolve, reject) => {
    zkTokenCheckService(cookie).then((info) => {
      let _ = Math.random();
      const { code, token, openId } = user;
      zkScoreService({ id: code, _ }, token).then(res => {
        editOne('user', openId, { isQuery: false });
        send(res, openId);
        allQuery();
        //  去把剩余的用户都执行一次
        resolve(`成绩已发送`);
      }).catch((err) => {
        reject(err.data);
      });
    }).catch((err) => {
      if(err.status === 203 && index <= 2) {
        check(user).then((token) => {
          user.token = token;
          return getInfo(user);
        }).catch(err => {
          reject(err);
        })
      } else {
        reject('用户信息获取失败');
      }
    })
  })
}

//  查询剩余的用户
async function allQuery() {
  const list = await read('user', { isQuery: true });
  if (list.data.length) {
    const user = list.data[0];
    getInfo(user).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }
}

//  主函数main
exports.main = async (event, context) => {
  return new Promise(async (resolve) => {
    try {
      //  判断当前时间是否为公布成绩时间,不是则不查询;
      const date = await read('date');
      //  公布成绩年月日
      const targetDate = dayjs(date.data[0].date).format('YYYYMMDD');
      //  当前年月日
      const curDate = dayjs(new Date()).format('YYYYMMDD');
      if (curDate >= targetDate) {
        //  开启定时器,每分钟执行一次,当时间为早上九点到晚上十一点时才去查询,否则不去查询;
        const hour = dayjs(new Date()).format('HH');
        //  由于云函数的实际是国际时间,需要+8小时才为北京时间;
        if (hour >= '01' && hour <= '15') {
          const list = await read('user', { isQuery: true });
          if (list.data.length) {
            const one = list.data[0];
            getInfo(one).then(res => {
              console.log(res);
              resolve({ code: 200, msg: '成功' });
            }).catch(err => {
              resolve({ code: 100, msg: err });
              console.log(err);
            });
          }
        }
      }
    } catch (err) {
      console.log(`出现了错误`, err);
      resolve({
        code: 202,
        err
      })
    }
  })
}
