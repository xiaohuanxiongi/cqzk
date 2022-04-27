const { edit, editMore } = require('../collection/index');

exports.main = async (event, ctx) => {
  const { codeId, time } = event;
  const date = new Date(time);
  const res = await edit('date', 'queryInfo', { codeId, date });
  await editMore('user', { isQuery: true }, { code: codeId });
  return res;
}
