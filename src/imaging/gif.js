const { exec } = require('child_process');
const { promisify } = require('util');

const execute = promisify(exec);

const isProd = false;

const nginxServeDir = isProd ? '/usr/share/nginx/html/' : '/tmp/gifs-out/';
const delay = 240;

module.exports.convertImagesToGif = async(imageDir, clid) => {
  const gifPath = `${nginxServeDir}${clid}.gif`;
  await execute(`mogrify -resize 600x450 -background black -gravity center -extent 600x450 ${imageDir}/*.jpg`)
  const { stdout, stdErr } = await execute(`convert -delay ${delay} -loop 0 ${imageDir}/*.jpg ${gifPath}`);
  if(stdErr){
    throw new Error('Error occurred making gif');
  }
  await execute(`rm -r ${imageDir}`);
  return gifPath;
}