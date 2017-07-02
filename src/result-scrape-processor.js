const GoogleSpreadsheet = require('google-spreadsheet');

const {promisify} = require('util');

const sheetId = '1EvjG_nq2lQBbVS89c22-rFXdyq0FcTldq-zsQd5YtIY';
const sheet = new GoogleSpreadsheet(sheetId);

const useServiceAccountAuth = promisify(sheet.useServiceAccountAuth);
const getInfo = promisify(sheet.getInfo);

async function getWorksheetRows(worksheet, getRowsOptions = {limit: 100, offset: 0}) {
  const getRows = promisify(worksheet.getRows);
  const rows = await getRows(getRowsOptions);
  rows.forEach((row) => {
    delete row._xml;
  })
  return rows
}

function defaultResultRow() {
  return {
    ID: 999,
    Alerted: 'N',
    Status: 'Open',
    GIF: '',
    URL: '',
    Title: '',
    Address: '',
    Rent: '',
    Beds: '',
    Baths: '',
    FT2: '',
    Laundry: '',
    Den: 'N',
    Loft: 'N',
    Parking: 'N',
    Dogs: 'N',
    Other: '',
    Comments: '',
    Contact: '',
    Viewing: '',
    Available: ''
  }
}

(async() => {
  await useServiceAccountAuth(require('../google_keys.json'));
  const info = await getInfo();
  const [ results, scrapes ] = info.worksheets;

  const resultRows = await getWorksheetRows(results);
  const scrapeRows = await getWorksheetRows(scrapes);

  const resultIDs = resultRows.map((row) => row.id);
  const scrapeIDs = scrapeRows.map((row) => row.id);

  var newListSet = new Set(scrapeIDs),
    resultSet = new Set(resultIDs);

  for (var elem of resultSet) {
    newListSet.delete(elem)
  }

  var newRows;
  for (var row of scrapeRows) {
    console.log(row.id)
    if (newListSet.has(row.id)) {
    }
  }
  console.log(results)
  console.log(resultRows)
  //results.addRow({})
})();