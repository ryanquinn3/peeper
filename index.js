const scrapeListings = require('./src/scrape');
const { writeObjectToFile } = require('./src/persist');
(async()=>{
  const scrapedListings = await scrapeListings();
  await writeObjectToFile('./scraped.json', scrapedListings);
})()




