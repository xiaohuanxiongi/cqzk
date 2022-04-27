const {
  zkCodeService,
  base64ImgService,
  zkLoginService,
  zkTokenCheckService,
  zkScoreService
} = require('../service');
const { readOne, editOne } = require('../collection/index');


//  base64转码
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
}

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
        console.log(err, `重新执行?`)
        return check({ zjhm, mm, openId });
      } else {
        reject(err);
      }
    }
  })
}

//  验证token
function getInfo(user, code) {
  const { token } = user;
  return new Promise((resolve, reject) => {
    zkTokenCheckService(token).then((info) => {
      let _ = Math.random();
      zkScoreService({ id: code, _ }, token).then(res => {
        //  去把剩余的用户都执行一次
        resolve(res);
      }).catch((err) => {
        reject(err.data);
      });
    }).catch((err) => {
      if(err.status === 203) {
        check(user).then((token) => {
          user.token = token;
          return getInfo(user, code);
        }).catch(err => {
          reject(err);
        })
      } else {
        reject('用户信息获取失败');
      }
    })
  })
}

exports.main = async (event) => {
  const { openId, code } = event;
  return new Promise(async (resolve) => {
    const user = await readOne('user', openId);
    getInfo(user.data, code).then(res => {
      console.log(res);
      resolve({ code: 200, data: res, msg: '成功' });
    }).catch(err => {
      console.log(err);
      resolve({ code: 400, msg: err });
    });
  })
}
