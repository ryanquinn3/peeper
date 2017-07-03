const { prop, map } = require('ramda');
//const giffyPoo = require('./src/imaging/.js');

const pickClid = map(prop('clid'));
async function processScrapeResults(scrapesRows, resultsRows) {

  const scrapeIDs = pickClid(scrapesRows);
  const resultIDs = pickClid(resultsRows);

  var newIDSet = new Set(scrapeIDs),
    resultIDSet = new Set(resultIDs);

  for (var elem of resultIDSet) {
    newIDSet.delete(elem)
  }

  const remainingRows = scrapesRows.filter((row)=>newIDSet.has(row.clid));
  for (var i in remainingRows){
    let row = remainingRows[i];
    /*
    let images = row.images;
    gifUrl = giffyPoo(images);
    */
    gifURL = '';
    Object.assign(row, {
      status: 'Open',
      gif: gifURL,
    })
  }
  return remainingRows
}

//processScrapeResults
module.exports = async (scrapesRows, resultsRows) => {
  var results = await processScrapeResults(scrapesRows, resultsRows);
  console.log('Found ', results.length, ' new entries!')
  return results
};
