const axios = require('axios');
const { print } = require('../logging');
const config = require('config');

module.exports.sendSlackMessage = async ({text, attachments=[]}) => {
  print(JSON.stringify({ text, attachments }));
  if(process.env.NODE_ENV === 'production') {
    return await axios.post(config.get('slack.chatUrl'), {
      text,
      attachments
    })
  }
};

