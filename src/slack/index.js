const axios = require('axios');

const config = require('config');

module.exports.sendSlackMessage = async ({text, attachments=[]}) => (
  await axios.post(config.get('slack.chatUrl'), {
    text,
    attachments
  })
);

