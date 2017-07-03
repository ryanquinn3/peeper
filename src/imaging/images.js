const fs = require('fs');
const axios = require('axios');

const streamOptions = { responseType:'stream' };

module.exports.saveImageToDisk = async(imageUrl, outPath) => {
  const response = await axios.get(imageUrl, streamOptions);
  response.data.pipe(fs.createWriteStream(outPath));
};