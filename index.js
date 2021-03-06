const scrapeListings = require('./src/scrape');
const { writeObjectToFile } = require('./src/persist');
const normalizeScrape = require('./src/normalize-scrape.js');
const { Sheet } = require('./src/sheets');
const processScrapeResults = require('./src/result-scrape-processor.js');
const { sendSlackMessage } = require('./src/slack/index.js');
const { makeSlackMessage } = require('./src/slack/message.js');

const { print } = require('./src/logging');

const config = require('config');

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

    // const writtenListings = [];
    // for(const listing of listings){
    //   try{
    //     await scrapesSheet.addRow(listing);
    //     writtenListings.push(listing);
    //   } catch(e){
    //     print('Failed scrape')
    //   }
    // }
    print(`Size of listings: ${listings.length}`);
    await Promise.all(listings.map((listing) => scrapesSheet.addRow(listing)));

    const scrapedRows = await scrapesSheet.getRows();
    const resultsRows = await resultsSheet.getRows();
    print('Processing new scrapes');
    const newResults = await processScrapeResults(scrapedRows, resultsRows);

    if(newResults.length === 0){
      await sendSlackMessage({
        text: `Scrape was successful. Found ${listings.length} listings but none were new.`
      })
    } else {
      await Promise.all(newResults.map((res) => resultsSheet.addRow(res)));
      await sendSlackMessage({
        text: `Scrape was successful. Found ${listings.length} listings and ${ newResults.length } were new.`
      });
      await Promise.all(newResults.map((res) => sendSlackMessage(makeSlackMessage(res))));
    }
    

  }catch(e){
    await sendSlackMessage({
      text: `Error occurred during scrape`,
      attachments: [
        {
          title: 'Error dump:',
          text: `${e.message} ${e.stack}`,
        }
      ]
    })

  }
  

})();




