const scrapeListings = require('./src/scrape');
const { writeObjectToFile } = require('./src/persist');
const normalizeScrape = require('./src/normalize-scrape.js');
const { Sheet } = require('./src/sheets');
const processScrapeResults = require('./src/result-scrape-processor.js');
const { sendSlackMessage } = require('./src/slack/index.js');
const { makeSlackMessage } = require('./src/slack/message.js');

const print = (...args) => console.log(`[${new Date().toLocaleTimeString()}] `, ...args);

(async()=> {

  try {
    print('Beginning scrape job');
    let scrapedscraped = await scrapeListings();
    print('Have scrapes, normalizing');
    let listings = await normalizeScrape(scrapedscraped);
    await writeObjectToFile('./listings.json', {listings});
    const scrapesSheet = new Sheet('scrapes');
    const resultsSheet = new Sheet('results');
    print('Adding to scrapes sheet');
    await Promise.all(listings.map((listing) => scrapesSheet.addRow(listing)));

    scrapedRows = await scrapesSheet.getRows();
    resultsRows = await resultsSheet.getRows();
    print('Processing new scrapes');
    const newResults = await processScrapeResults(scrapedRows, resultsRows);
    
    await Promise.all(newResults.map((res) => resultsSheet.addRow(res)));

    await Promise.all(newResults.map((res) => sendSlackMessage(makeSlackMessage(res))));
  }catch(e){
    console.error(e);
  }
  

})()




