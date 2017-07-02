const fs = require('fs');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

module.exports.writeObjectToFile = async(path, object) => {
  return await writeFile(path, JSON.stringify(object, null, 2));
};