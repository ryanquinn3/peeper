const scrape = require('scrape-it');
const { prop, map, compose, trim, evolve } = require('ramda');

const baseUrl = 'https://sfbay.craigslist.org';
const searchUrl = `${baseUrl}/search/sfc/apa?hasPic=1&nh=12&max_price=4000&min_bedrooms=1&availabilityMode=0&laundry=1&laundry=4`;

const trimNewlines = (text) => text.replace(/(?:\r\n|\r|\n)/g, '');

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
    body: trimNewlines,
    address: trimNewlines,
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
  console.log(`Total results: ${apartments.length}`);
  const addBase = (url) => `${baseUrl}${url}`;

  const addBaseUrlsToResults = compose(
    map(addBase),
    map(prop('link')),
  );

  return addBaseUrlsToResults(apartments);
}

module.exports = async () => {
  const postingsList = await scrapeListings();

  const detailPromises = postingsList.map(scrapeFromDetailPage);

  return await Promise.all(detailPromises);

};
