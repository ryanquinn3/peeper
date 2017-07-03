const { saveListingImagesToTmp, convertImagesToGif } = require('./imaging');

const { prop, map, pick, compose, set, lensProp, values } = require('ramda');
const print = (...args) => console.log(`[${new Date().toLocaleTimeString()}] `, ...args);

const pickClid = map(prop('clid'));

async function determineNewResults(scrapesRows, resultsRows) {

  const scrapeIDs = pickClid(scrapesRows);
  const resultIDs = pickClid(resultsRows);

  const newIDSet = new Set(scrapeIDs);
  const resultIDSet = new Set(resultIDs);

  print(`Size of scrape set: ${newIDSet.size}`);
  print(`Size of result set: ${resultIDSet.size}`);

  for (var elem of resultIDSet) {
    newIDSet.delete(elem)
  }

  const rowsPendingAdd = scrapesRows
    .filter((row) => newIDSet.has(row.clid));

  const rowsKeyByClid = rowsPendingAdd
    .reduce((accum, result) => Object.assign(accum, { [result.clid]: result }), {});
  
  return values(rowsKeyByClid)
    .map(convertScrapeRowToResult)
    .map(set(lensProp('status'), 'Open'));
}

function convertScrapeRowToResult(scrapeRow){
  const fieldsToExtract = [
    'clid',
    'url',
    'cltitle',
    'address',
    'rent',
    'beds',
    'baths',
    'ft2',
    'laundry',
    'den',
    'loft',
    'parking',
    'dogs',
    'other',
    'available',
    'posted',
    'images',
  ];
  return pick(fieldsToExtract, scrapeRow);
}

async function makeAndPublishGif(row){
  const outDir = await saveListingImagesToTmp(row);
  const gifPath = await convertImagesToGif(outDir, row.clid);
  print(`Gif to saved to ${gifPath}`);
  row.gif = ''+gifPath;
  return row;
}


//processScrapeResults
module.exports = async (scrapesRows, resultsRows) => {
  const results = await determineNewResults(scrapesRows, resultsRows);
  print('Found ', results.length, ' new entries!');

  for(let res of results) {
    res = await makeAndPublishGif(res); 
  }
  return results;
};
