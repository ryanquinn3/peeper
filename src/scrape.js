const scrape = require('scrape-it');
const { prop, map, compose, trim, evolve } = require('ramda');
const { print } = require('./logging');

const baseUrl = 'https://sfbay.craigslist.org';

const searchUrl = `${baseUrl}/search/sfc/apa?nh=149&nh=4&nh=6&nh=12&nh=24&nh=19&nh=27&min_price=3500&max_price=4850&min_bedrooms=2&max_bedrooms=3&min_bathrooms=1&availabilityMode=0&housing_type=1&housing_type=2&laundry=1&laundry=4`;

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
