

function defaultListing() {
  return {
    id: 999,
    alerted: 'N',
    status: 'Open',
    gif: '',
    url: '',
    title: '',
    address: '',
    rent: '',
    beds: '',
    baths: '',
    ft2: '',
    laundry: '',
    den: 'N',
    loft: 'N',
    parking: 'N',
    dogs: 'N',
    other: '',
    comments: '',
    contact: '',
    viewing: '',
    available: '',
  }
}

function handleAttributes(listAttributes){
  const attributes = {
    beds: 9,
    baths: 9,
    ft2: 0,
    dogs: 'N',
    laundry: '',
    parking: '',
    available: '',
    other: '',
  }

  var other = '';
  console.log(listAttributes)
  
  for (var i in listAttributes){
    la = listAttributes[i];
    if (la.includes('BR')){
      var deets = la.split('/');
      Object.assign(attributes, { beds: deets[0], baths: deets[1] } )
    } else if(la.includes('ft2')){
      Object.assign(attributes, { ft2: la } )
    } else if(la.includes('wooof')){
      Object.assign(attributes, { dogs: 'Y' } )
    } else if(la.includes('purrr')){
      continue;
    } else if(la.includes('available')){
      la = la.replace('available ','')
      Object.assign(attributes, { available: la } )
    } else if(la.includes('w/d')){
      Object.assign(attributes, { laundry: la } )
    } else if(la.includes('parking') | la.includes('garage')){
      Object.assign(attributes, { parking: la })
    } else {
      other = other.concat(la, ' | ');
    }
  }
  Object.assign(attributes, { other });
  
  return attributes
  
}


function cleanListing(rawListing){
  console.log(rawListing)
  rawListing.body = rawListing.body.replace(/\\\\n/g, "*");
  var newListing = defaultListing();
  const attributes = handleAttributes(rawListing.attributes);

  Object.assign(newListing,
    attributes,
    {
      title: rawListing.title,
      rent: rawListing.price,
      id: Number(rawListing.postInfo[1].split(': ')[1]),
      posted: rawListing.postInfo[2].split(': ')[1],
      url: rawListing.url,
    },
    {
      den: rawListing.body.match(/\Wden\W/g)? 'Y':'N',
      loft: rawListing.body.match(/loft/g)? 'Y':'N'
    });
  console.log(newListing);

  
}


module.exports = async (rawListings) => {
  const test = rawListings.slice(0,1);
  return test.map(cleanListing);
};
