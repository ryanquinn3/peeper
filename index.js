const scrapeListings = require('./src/scrape');
const { writeObjectToFile } = require('./src/persist');
const normalizeScrape = require('./src/normalize-scrape.js');
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
  let listings;
  try {
    listings = require('./listings.json');
  }
  catch(e){
    console.log('Cache file missing. Normalizing listings and saving..');
    listings = await normalizeScrape(scraped);
    await writeObjectToFile('./listings.json', {listings});
  }
  
})()




