const scrapeListings = require('./src/scrape');
const { writeObjectToFile } = require('./src/persist');
const normalizeScrape = require('./src/normalize-scrape.js');
(async()=>{
  const scrapedListings = require('./scraped.json');
  //const scrapedListings = await scrapeListings();
  //await writeObjectToFile('./scraped.json', scrapedListings);
  const normListings = normalizeScrape(scrapedListings);
  console.log(normListings);
})()




