const { exec } = require('child_process');
const { promisify } = require('util');

const execute = promisify(exec);

const isProd = process.env.NODE_ENV === 'production';

const writeDir = isProd ? '/www/' : '/tmp/gifs-out/';
const serveDir = isProd ? 'http://104.131.135.228/' : writeDir;
const delay = 240;

module.exports.convertImagesToGif = async(imageDir, clid) => {
  const gifPath = `${writeDir}${clid}.gif`;
  try {
    await execute(`mogrify -resize 600x450 -background black -gravity center -extent 600x450 ${imageDir}/*.jpg`)
  }
  catch(e){
    console.error(e);
    return `${serveDir}/404.html`;
  }
  const { stdout, stdErr } = await execute(`convert -delay ${delay} -loop 0 ${imageDir}/*.jpg ${gifPath}`);
  if(stdErr){
    return `${serveDir}/404.html`;
  }
  await execute(`rm -r ${imageDir}`);
  return `${serveDir}${clid}.gif`;
};
