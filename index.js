
const scrapeListings = require('./src/scrape');
(async()=>{
  const scrapedListings = await scrapeListings();
  console.log(scrapedListings)
})()
