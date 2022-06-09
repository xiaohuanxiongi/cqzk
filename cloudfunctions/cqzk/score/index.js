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

//  获取token
async function auth({ zjhm, mm, openId }) {
  return new Promise(async (resolve, reject) => {
    try {
      const flow = await zkCodeService({ _: Math.random() });
      const cookie = flow.headers["set-cookie"][0].split(';')[0];
      const base64 = "data:image/png;base64," + btoa(new Uint8Array(flow.data).reduce((data, byte) => data + String.fromCharCode(byte), ""));
      const code = await base64ImgService({ data: base64 });
      const params = { zjhm, mm, vrifyCode: code.data};
      const isLogin = await zkLoginService(params, cookie);
      if (!isLogin) {
        resolve(cookie);
        readOne('user', openId).then(async () => {
          await editOne('user', openId, { token: cookie })
        }).catch(() => {
          //  不做操作
        })
      }
    } catch (err) {
      console.log(err)
      if(err === "验证码错误") {
        return auth({ zjhm, mm, openId });
      } else {
        reject(err)
      }
    }
  })
}
//  查询成绩
function query(user, code) {
  const { token = '', zjhm, mm, openId } = user;
  return new Promise((resolve, reject) => {
    zkTokenCheckService(token).then((info) => {
      const _ = Math.random();
      zkScoreService({ id: code, _ }, token).then((res) => {
        console.log(`调用成功`, res);
        resolve(res);
      }).catch((err) => {
        reject(err.data);
      })
    }).catch((err) => {
      if (err.status === 203) {
        auth({ zjhm, mm, openId }).then((token) => {
          user.token = token;
          resolve(query(user, code));
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
  const { openId, code, zjhm, mm } = event;
  let user = {};
  return new Promise(async (resolve) => {
    if (zjhm && mm) {
      user = { zjhm, mm, openId }
    } else {
      const { data } = await readOne('user', openId);
      user = data;
    }
    query(user, code).then(res => {
      resolve({ code: 200, data: res, msg: '成功' });
    }).catch(err => {
      resolve({ code: 400, msg: err });
    })
  })
}
