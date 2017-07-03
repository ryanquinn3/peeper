const { exec } = require('child_process');
const { promisify } = require('util');

const execute = promisify(exec);


const delay = 240;

module.exports.convertImagesToGif = async(listingRow) => {
  const gifPath = '';
  const imagePath = '';
  const { stdout } = await execute(`convert -delay ${delay} -loop 0 ${imagePath}/*.jpg ${gifPath}.gif`);
  console.log(stdout);
  return gifPath;
}