const scrape = require('scrape-it');
const { prop, map, compose, trim, evolve } = require('ramda');

const baseUrl = 'https://sfbay.craigslist.org';
const searchUrl = `${baseUrl}/search/sfc/apa?hasPic=1&nh=12&max_price=4000&min_bedrooms=1&availabilityMode=0&laundry=1&laundry=4`;
const print = (...args) => console.log(`[${new Date().toLocaleTimeString()}] `, ...args);

const trimNewlines = (text) => text.replace(/(?:\r\n|\r|\n)/g, '');

const clean = (text) => text.replace(/\s{2,}/g, ' ');

const removeGoogleMaps = (text) => text.replace('(google map)', '');

const fullTrim = compose(trim, removeGoogleMaps, clean, trimNewlines);

async function scrapeFromDetailPage(url){
  const scrapeDetails = await scrape(url, {
    title: '#titletextonly',
    price: '.postingtitletext .price',
    attributes: {
      listItem: 'p.attrgroup span',
      convert: trim
    },
    images: {
      listItem: 'a.thumb',
      data: {
        link: {
          attr: 'href',
        },
      },
    },
    body: '#postingbody',
    postInfo: {
      listItem: 'p.postinginfo',
    },
    address: '.mapaddress',
    longitude: {
      selector: '[data-longitude]',
      attr: 'data-longitude',
    },
    latitude: {
      selector: '[data-latitude]',
      attr: 'data-latitude',
    },
  });
  return evolve({
    images: map(prop('link')),
    body: fullTrim,
    address: fullTrim,
  }, Object.assign(scrapeDetails, { url }));
}
async function scrapeListings(){
  const { apartments } = await scrape(searchUrl, {
    apartments: {
      listItem: '.result-row',
      data: {
        link: {
          selector: ".result-title",
          attr: "href",
        }
      }
    }
  });
  print(`Total results: ${apartments.length}`);
  const addBase = (url) => `${baseUrl}${url}`;

  const addBaseUrlsToResults = compose(
    map(addBase),
    map(prop('link')),
  );

  return addBaseUrlsToResults(apartments);
}

module.exports = async () => {
  try {
    const postingsList = await scrapeListings();
    print('Scraped listings...');
    print('Fetching details...'); 
    const detailPromises = postingsList.map(scrapeFromDetailPage);

    return await Promise.all(detailPromises);
  }catch(e){
    console.log(e);
  }
  

};
