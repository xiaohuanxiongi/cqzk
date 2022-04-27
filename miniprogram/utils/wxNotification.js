//  生成一个存放数组
const __notices = [];
/**
 * 注册通知方法
 *
 * 参数:
 * name: 注册名称
 * selector: 对应的通知方法,接受通知后需要做的事情
 * observer: 注册对象,值的Page对象
 */
function addNotification (name, selector, observer) {
  if (name && selector) {
    if (!observer) {
      console.log(`没有对给对象,将无法删除通知`)
    }
    const newNotice = {
      name,
      selector,
      observer
    };
    //  往数组添加
    __notices.push(newNotice);
  } else {
    console.log(`没有给名字和方法`)
  }
}
/**
 * 发送通知方法
 *
 * 参数:
 * name: 已注册通知的的名称
 * info: 发送的参数
 */
function postNotificationName (name, info) {
  if (__notices.length === 0) {
    console.log(`你尚未添加任何通知`);
    return false;
  }
  for (let i = 0; i < __notices.length; i++) {
    let notice = __notices[i];
    if (notice.name === name) {
      notice.selector(info);
    }
  }
}
/**
 * 移除通知方法
 *
 * 参数:
 * name: 已注册通知的的名称
 * observer: 需要移除通知所在的Page对象
 */
function removeNotification (name, observer) {
  for (let i = 0; i < __notices.length; i++) {
    const notice = __notices[i];
    if (notice.name === name) {
      if (notice.observer === observer) {
        __notices.splice(i,1);
        return;
      }
    }
  }
}
module.exports = {
  addNotification: addNotification,
  removeNotification: removeNotification,
  postNotificationName: postNotificationName
}
