const axios = require('axios');

module.exports.sendSlackMessage = async (text, attachments=[]) => (
  await axios.post('https://hooks.slack.com/services/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', {
    text,
    attachments
  })
)