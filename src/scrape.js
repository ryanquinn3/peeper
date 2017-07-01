const scrape = require('scrape-it');


const searchUrl = 'https://sfbay.craigslist.org/search/sfc/apa?nh=12&max_price=4000&availabilityMode=0&laundry=1';

async function performSearch(){

  const page = await scrape(searchUrl, {
    apartments: {
      listItem: '.result-row',
      data: {
        price: '.result-price',
        housing: '.housing',
        link: {
          selector: ".result-title",
          attr: "href",
        }
      }
    }


  });

  console.log(page);
}

performSearch()
  .then(() => {

  });
