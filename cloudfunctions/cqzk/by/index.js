const {
  zkCodeService,
  base64ImgService,
  zkLoginService,
  ksInfoService,
  byKcService
} = require('../service');
const { readOne, editOne } = require('../collection/index');

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
        resolve({ code: 200, data: res.zyKcList });
      })
    }).catch((err) => {
      if(err.status === 203) {
        check(user).then((token) => {
          user.token = token;
          return getByKc(user);
        }).catch(err => {
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
    return await getByKc(info.data);
  } catch (err) {
    return { code: 400, msg: '你还未授权' };
  }
}
