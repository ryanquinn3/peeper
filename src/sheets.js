const GoogleSpreadsheet = require('google-spreadsheet');
const { omit, map, propEq } = require('ramda');

const { promisify } = require('util');

const sheetId = '1EvjG_nq2lQBbVS89c22-rFXdyq0FcTldq-zsQd5YtIY';

const sheet = new GoogleSpreadsheet(sheetId);

const useServiceAccountAuth = promisify(sheet.useServiceAccountAuth);
const getInfo = promisify(sheet.getInfo);

const removeXml = map(omit('_xml'));

let keys;

try {
  keys = require('../google_keys.json');
} catch(e){
  keys = require('/keys/google_keys.json');
}

class Sheet {
  constructor(title){
    this.title = title;
    this.instance = null;
  }

  async connect(){
    if(this.instance) {
      return this.instance;
    }
    await useServiceAccountAuth(keys);
    const { worksheets } = await getInfo();    
    const instance = worksheets.find((sheet) => {
      return sheet.title === this.title
    });
    if(!instance){
      throw new Error('No sheet found with that title');
    }
    this.instance = instance;
    this.instance.getRows = promisify(instance.getRows);
    this.instance.addRow = promisify(instance.addRow);
    return this.instance;
  }

  async getRows(rowOptions = { offset: 0 , limit: 100 }){
    await this.connect();
    const rows = await this.instance.getRows(rowOptions);
    return rows
  }

  async getRowById(id){
    const rows = await this.getRows();
    return rows.find(propEq('id', id));
  }

  async addRow(row){
    await this.connect();  
    return await this.instance.addRow(row);
  
  }

}
module.exports.Sheet = Sheet;
