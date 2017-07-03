const fs = require('fs');
const { zip } = require('ramda');
const axios = require('axios');

const streamOptions = { responseType:'stream' };

const tmpDir = '/tmp/';

const tmpImageFilename = (scrapedRow) => (_, index) => `${tmpDir}${scrapedRow.clid}/${index}.jpg`;

async function saveImageToDisk(imageUrl, outPath){
  const response = await axios.get(imageUrl, streamOptions);

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(outPath)
    response.data.pipe(stream);
    stream.on('close', () => {
      resolve(outPath);
    });
    stream.on('error', () => reject('Wtf'));
  });
};


module.exports.saveListingImagesToTmp = async(listing) => {
  const images = listing.images.split(',');
  const outDir = `${tmpDir}${listing.clid}`;
  const paths = images.map(tmpImageFilename(listing));
  const inOut = zip(images, paths);  
  fs.mkdirSync(outDir);
  await Promise.all(inOut.map((args) => saveImageToDisk(...args)));
  return outDir;
};