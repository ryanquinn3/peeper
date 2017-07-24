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
  }
  const { stdout, stdErr } = await execute(`convert -delay ${delay} -loop 0 ${imageDir}/*.jpg ${gifPath}`);
  if(stdErr){
    throw new Error('Error occurred making gif');
  }
  await execute(`rm -r ${imageDir}`);
  return `${serveDir}${clid}.gif`;
};
