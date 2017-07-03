const scrapeListings = require('./src/scrape');
const { writeObjectToFile } = require('./src/persist');
const normalizeScrape = require('./src/normalize-scrape.js');
const { Sheet } = require('./src/sheets');
const processScrapeResults = require('./src/result-scrape-processor.js');
const { sendSlackMessage } = require('./src/slack/index.js');
const { makeSlackMessage } = require('./src/slack/message.js');


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
  try {
  console.log('Have scrapes, normalizing');
  let listings = await normalizeScrape(scraped);
  await writeObjectToFile('./listings.json', {listings});
  const scrapesSheet = new Sheet('scrapes');
  const resultsSheet = new Sheet('results');
  console.log('Adding to scrapes sheet');
  await Promise.all(listings.map((listing) => scrapesSheet.addRow(listing)));

  scrapedRows = await scrapesSheet.getRows();
  resultsRows = await resultsSheet.getRows();
  console.log('Processing new scrapes');
  const newResults = await processScrapeResults(scrapedRows, resultsRows);
  
  await Promise.all(newResults.map((res) => resultsSheet.addRow(res)));

  //await Promise.all(newResults.map((res) => console.log(makeSlackMessage(res))));
  await Promise.all(newResults.map((res) => sendSlackMessage(makeSlackMessage(res))));
  }catch(e){
    console.error(e);
  }
  

})()




