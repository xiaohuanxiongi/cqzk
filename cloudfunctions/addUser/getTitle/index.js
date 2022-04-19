const { read } = require('../collection/index');

exports.main = async (event, context) => {
  return await read('title');
}

