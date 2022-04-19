const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

//  增
async function writeDb(name, params) {
  try {
    await db.createCollection(name);
    await db.collection(name).add({
      data: params
    });
    return {
      success: true
    };
  } catch (err) {
    return {
      success: true,
      data: 'create collection success'
    }
  }
}

//  查
async function read(name, params) {
  if (params) {
    return await db.collection(name).where(params).get();
  } else {
    return await db.collection(name).get();
  }
}

//  改
async function edit(name, id, params) {
  return await db.collection(name).doc(id).set({ data: params });
}

//  改一个属性
async function editOne(name, id, params) {
  return await db.collection(name).doc(id).update({ data: params });
}
module.exports = {
  read,
  editOne
}
