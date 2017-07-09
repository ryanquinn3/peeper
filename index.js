const scrapeListings = require('./src/scrape');
const { writeObjectToFile } = require('./src/persist');
const normalizeScrape = require('./src/normalize-scrape.js');
const { Sheet } = require('./src/sheets');
const processScrapeResults = require('./src/result-scrape-processor.js');
const { sendSlackMessage } = require('./src/slack/index.js');
const { makeSlackMessage } = require('./src/slack/message.js');

const config = require('config');

const print = (...args) => {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = now.toDateString();
  console.log(`[${date} ${time}] `, ...args);
};

(async()=> {

  try {
    print('Beginning scrape job');
    let scrapedscraped = await scrapeListings();
    print('Have scrapes, normalizing');
    let listings = await normalizeScrape(scrapedscraped);
    await writeObjectToFile('./listings.json', {listings});
    const scrapesSheet = new Sheet(config.get('google.scrapesWorkbookName'));
    const resultsSheet = new Sheet(config.get('google.resultWorkbookName'));
    print('Adding to scrapes sheet');
    await Promise.all(listings.map((listing) => scrapesSheet.addRow(listing)));

    scrapedRows = await scrapesSheet.getRows();
    resultsRows = await resultsSheet.getRows();
    print('Processing new scrapes');
    const newResults = await processScrapeResults(scrapedRows, resultsRows);

    if(newResults.length === 0){
      await sendSlackMessage({
        text: 'No new apartments found today.'
      })
    } else {
      await Promise.all(newResults.map((res) => resultsSheet.addRow(res)));
      await Promise.all(newResults.map((res) => sendSlackMessage(makeSlackMessage(res))));
    }
    

  }catch(e){
    await sendSlackMessage({
      text: `Error occurred during scrape`,
      attachments: [
        {
          title: 'Error dump:',
          text: e.stack,
        }
      ]
    })

  }
  

})();




