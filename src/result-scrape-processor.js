const { saveListingImagesToTmp, convertImagesToGif } = require('./imaging');

const { prop, map, pick, compose, set, lensProp } = require('ramda');


const pickClid = map(prop('clid'));

async function determineNewResults(scrapesRows, resultsRows) {

  const scrapeIDs = pickClid(scrapesRows);
  const resultIDs = pickClid(resultsRows);

  const newIDSet = new Set(scrapeIDs);
  const resultIDSet = new Set(resultIDs);

  for (var elem of resultIDSet) {
    newIDSet.delete(elem)
  }

  const newResults = scrapesRows
    .filter((row) => newIDSet.has(row.clid))
    .map(convertScrapeRowToResult)
    .map(set(lensProp('status'), 'Open'));
    
  return newResults;
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
  console.log(`Gif to saved to ${gifPath}`);
  row.gif = ''+gifPath;
  return row;
}


//processScrapeResults
module.exports = async (scrapesRows, resultsRows) => {
  const results = await determineNewResults(scrapesRows, resultsRows);
  console.log('Found ', results.length, ' new entries!')
  return await Promise.all(results.map(makeAndPublishGif));
};
