const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  plugin_id: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: String
  },
  language: {
    type: String,
    required: false,
  },
  query: [
    {
      querySearch: {
        type: String,
      },
      google_news_query: [{
        url: {
          type: String,
        },
        heading: {
          type: String,
        },
        time_stamp: {
          type: String,
        },
      }],
      google_query:[ {
        url: {
          type: String,
        },
        heading: {
          type: String,
        }
      }],
    },
  ],
});
module.exports = mongoose.model("dataModel", dataSchema);
