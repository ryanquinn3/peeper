
//const giffyPoo = require('./src/imaging/.js');

const { prop, map, pick, compose, set, lensProp } = require('ramda');


const pickClid = map(prop('clid'));

async function processScrapeResults(scrapesRows, resultsRows) {

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
    .map(set(lensProp('alerted'), 'N'))
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
  ];
  return pick(fieldsToExtract, scrapeRow);
}


//processScrapeResults
module.exports = async (scrapesRows, resultsRows) => {
  const results = await processScrapeResults(scrapesRows, resultsRows);
  console.log('Found ', results.length, ' new entries!')
  return results
};
