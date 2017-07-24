const { print } = require('./logging');

function defaultListing() {
  return {
    clid: 999,
    status: 'Open',
    url: '',
    cltitle: '',
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
    available: '',
    latitude: '',
    longitude: '',
    scraped: new Date(),
  }
}

const na = {
  0: 'N/A',
  1: 'N/A',
  2: 'N/A',
  split(){
    return ['N/A', 'N/A', 'N/A'];
  }
};

function handleAttributes(listAttributes){
  const attributes = {}
  var other = '';
  
  for (var i in listAttributes){
    la = listAttributes[i];
    if (la.includes('BR')){
      var deets = la.split('/');
      Object.assign(attributes, {
        beds: Number((deets[0] || na).split('B')[0]),
        baths: Number((deets[1] || na).split('B')[0])
      })
    } else if(la.includes('ft2')){
      Object.assign(attributes, { ft2: Number((la || na).split('ft2')[0])} )
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
  rawListing.body = (rawListing.body || '').replace(/\\\\n/g, "*");
  rawListing.postInfo = rawListing.postInfo || na;

  const attributes = handleAttributes(rawListing.attributes);
  
  return Object.assign(
    defaultListing(),
    attributes,
    {
      cltitle: rawListing.title,
      rent: Number(rawListing.price.split('$')[1]),
      clid: Number((rawListing.postInfo[1] || na).split(': ')[1]),
      posted: (rawListing.postInfo[2] || na).split(': ')[1],
      url: rawListing.url,
      den: rawListing.body.match(/\W[dD]en\W/g)? 'Y':'N',
      loft: rawListing.body.match(/loft/g)? 'Y':'N', 
      address: rawListing.address,
      latitude: Number(rawListing.latitude),
      longitude: Number(rawListing.longitude),
      images: rawListing.images.join(','),
    },
  );
}

module.exports = async (rawListings) => {
  const cleanListings = [];

  for(const raw of rawListings){
    try{
      cleanListings.push(cleanListing(raw));
    }
    catch(e){
      print(raw);
    }
  }

  return cleanListings;
};
