const { edit } = require('../collection/index');
const { zkCodeService, base64ImgService, zkLoginService } = require('../service');
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

async function check({ zjhm, mm, openId, codeId }) {
  return new Promise(async resolve => {
    try {
      const flow = await zkCodeService({ _: Math.random() });
      const cookie = flow.headers["set-cookie"][0].split(';')[0];
      const base64 = "data:image/png;base64," + btoa(new Uint8Array(flow.data).reduce((data, byte) => data + String.fromCharCode(byte), ""));
      const code = await base64ImgService({ data: base64 });
      const params = { zjhm, mm, vrifyCode: code.data};
      const isLogin = await zkLoginService(params, cookie);
      if (!isLogin) {
        const item = { zjhm, mm, openId, token: cookie, code: codeId };
        //  使用doc才查询,当这个用户存在时更新,不存在则新增;
        await edit('user', openId, item);
        resolve({ code: 200, msg: '登录成功' });
      } else {
        resolve({ code: 400, msg: isLogin });
      }
    } catch (err) {
      if(err === "验证码错误") {
        return check({ zjhm, mm, openId, codeId });
      } else {
        resolve({ code: 400, msg: err });
      }
    }
  })
}

exports.main = async (event, context) => {
  return await check(event)
}
