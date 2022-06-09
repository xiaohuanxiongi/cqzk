const {
  zkCodeService,
  base64ImgService,
  zkLoginService,
  ksInfoService,
  byKcService
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
        return check({ zjhm, mm, openId });
      } else {
        reject(err);
      }
    }
  })
}

function getByKc(user) {
  const cookie = user.token;
  return new Promise(resolve => {
    ksInfoService(cookie).then((info) => {
      const _ = Math.random();
      const id = info.zcList[0]['kkzyid'];
      byKcService({ kkzyid: id }, cookie).then((res) => {
        resolve({ code: 200, data: { zyKcList: res.zyKcList, zy: res.zy } });
      })
    }).catch((err) => {
      console.log(err)
      if(err.status === 203) {
        check(user).then((token) => {
          user.token = token;
          resolve(getByKc(user));
        }).catch(err => {
          console.log(`报错信息:`, err);
          resolve({ code: 400, msg: err });
        })
      } else {
        resolve({ code: 202, msg: `用户信息获取失败` });
      }
    })
  })
}

exports.main = async (event) => {
  const { openId } = event;
  try {
    const info = await readOne('user', openId);
    const data = await getByKc(info.data);
    console.log(`返回成功:`, data);
    return data;
  } catch (err) {
    console.log(`返回失败:`, err)
    return { code: 400, msg: '你还未授权' };
  }
}
