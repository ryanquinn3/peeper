const { resolve } = require('path');

module.exports = {
  google: {
    sheetId: '1EvjG_nq2lQBbVS89c22-rFXdyq0FcTldq-zsQd5YtIY',
    keyFile: resolve(__dirname, '../google_keys.json'),
    resultWorkbookName: 'results',
    scrapesWorkbookName: 'scrapes',
  },
  slack: {
    chatUrl: 'https://hooks.slack.com/services/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'
  }
};
