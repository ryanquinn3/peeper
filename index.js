const scrapeListings = require('./src/scrape');
const { writeObjectToFile } = require('./src/persist');
(async()=>{

  let scraped;
  try {
    scraped = require('./scraped.json');
  }
  catch(e){
    console.log('Cache file missing. Performing scrape and saving..');
    scraped = await scrapeListings();
    await writeObjectToFile('./scraped.json', scraped);
  }
  
})()




