const GoogleSpreadsheet = require('google-spreadsheet');

const { promisify } = require('util');

const sheetId = '1EvjG_nq2lQBbVS89c22-rFXdyq0FcTldq-zsQd5YtIY';

const sheet = new GoogleSpreadsheet(sheetId);

const useServiceAccountAuth = promisify(sheet.useServiceAccountAuth);

const getInfo = promisify(sheet.getInfo);

(async() => {
  await useServiceAccountAuth(require('../google_keys.json'));
  const info = await getInfo();

  const [ worksheet ] = info.worksheets;


  const getRows = promisify(worksheet.getRows);


  const rows = await getRows({ offset: 0 , limit: 100 });
  
  rows.forEach((row) => {
    delete row._xml;
  })

  console.log(`Total rows returned: ${rows.length}`); 
  console.log(JSON.stringify(rows));

  //  const rows = await getRows({ offset: 1, limit: 100 });


})();