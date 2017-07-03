const scrapeListings = require('./src/scrape');
const { writeObjectToFile } = require('./src/persist');
const normalizeScrape = require('./src/normalize-scrape.js');
const { Sheet } = require('./src/sheets');
const processScrapeResults = require('./src/result-scrape-processor.js');
<<<<<<< Updated upstream

const { sendSlackMessage } = require('./src/slack/index.js');
const { makeSlackMessage } = require('./src/slack/message.js');

=======
const { saveListingImagesToTmp, convertImagesToGif } = require('./src/imaging');
>>>>>>> Stashed changes

(async()=> {
  let scraped;
  try {
    scraped = require('./scraped.json');
  }
  catch(e){
    console.log('Cache file missing. Performing scrape and saving..');
    scraped = await scrapeListings();
    await writeObjectToFile('./scraped.json', scraped);
  }

  let listings = await normalizeScrape(scraped);
  await writeObjectToFile('./listings.json', {listings});
  const scrapesSheet = new Sheet('scrapes');
  const resultsSheet = new Sheet('results');
 // await Promise.all(listings.map((listing) => scrapesSheet.addRow(listing)));


  scrapedRows = await scrapesSheet.getRows();
  resultsRows = await resultsSheet.getRows();
  const outDir = await saveListingImagesToTmp(scrapedRows[0]);
  const gifPath = await convertImagesToGif(outDir, scrapedRows[0].clid);
  console.log(`Gif to saved to ${gifPath}`);
  
  const newResults = await processScrapeResults(scrapedRows, resultsRows);
  

<<<<<<< Updated upstream
  // const practiceRow = resultsRows[0];
  // const message = await makeSlackMessage(practiceRow);
  // sendSlackMessage(message);

=======
>>>>>>> Stashed changes
  // await Promise.all(newResults.map((res) => resultsSheet.addRow(res)));

})()




