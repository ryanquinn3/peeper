

async function processScrapeResults(scrapesRows, resultsRows) {

  const scrapeIDs = scrapesRows.map((row) => row.clid);
  const resultIDs = resultsRows.map((row) => row.clid);

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
      alerted: 'N',
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
