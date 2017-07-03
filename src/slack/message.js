// https://api.slack.com/docs/messages/builder?msg=%7B%22text%22%3A%22%3C!here%3E%22%2C%22attachments%22%3A%5B%7B%22text%22%3A%22And%20here%E2%80%99s%20an%20attachment!%22%7D%5D%7D

module.exports.makeSlackMessage = async(row) => (
{
  "text": "<!here>",
  "attachments": [
    {
      "fallback": "Required plain-text summary of the attachment.",
      "color": "#36a64f",
      "pretext": "I found you a new apartment!",
      "author_name": "Google Sheet",
      "author_link": "https://docs.google.com/spreadsheets/d/1EvjG_nq2lQBbVS89c22-rFXdyq0FcTldq-zsQd5YtIY/edit?usp=sharing",
      "title": row.cltitle,
      "title_link": row.url,
      "text": `${row.rent} | ${row.beds} Bed | ${row.baths} Bath`,
      "image_url": row.gif,
    }
  ]
}
)