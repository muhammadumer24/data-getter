const dataModel = require("../models/data");
const addData = async (req, res) => {
  try {
    const { query, date, location, plugin_id, language } = req.body;
    const data=await dataModel.find({date,plugin_id})
    if(data){
      res.sendStatus(200)
      return
    }
     await dataModel.create({
      query,
      date,
      location,
      plugin_id,
      language,
    });
    res.sendStatus(200);
  } catch (error) {
    console.log("Data Making Error:", error);
    res.sendStatus(500);
  }
};
const filterData = async (req, res) => {
  try {
    let filter = {};
    const { language, location, date, plugin_id } = req.body;
    if (language) {
      filter = { ...filter, language };
    }
    if (location) {
      filter = { ...filter, location };
    }
    if (date) {
      filter = { ...filter, date };
    }
    if (plugin_id) {
      filter = { ...filter, plugin_id };
    }
    const data = await dataModel.aggregate([
      {
        $match: filter, // Apply your filter conditions
      },
      {
        $unwind: '$query', // Unwind the 'query' array
      },
      {
        $sort: { 'query.querySearch': 1 }, // Sort by 'querySearch'
      },
      {
        $group: {
          _id: "$_id",
          language: { $first: '$language' }, // Preserve other fields
          plugin_id: { $first: '$plugin_id' },
          location: { $first: '$location' },
          date: { $first: '$date' },
          query: { $push: '$query' }, // Reassemble the 'query' array
        },
      },
    ]);
    res.send(data);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
};
const deleteAll = async (req, res) => {
  try {
    await dataModel.deleteMany();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
const getCommonData = async (req, res) => {
  try {
    const { q } = req.query;
    const allData = await dataModel
      .find()
      .select(
        "query.google_query.url query.google_news_query.url query.querySearch -_id"
      );
    let google_query_url = new Set();
    let google_query_news_url = new Set();
    let google_url_count = [];
    let google_news_url_count = [];
    allData.map((doc) => {
      doc.query.map((item) => {
        if (item.querySearch === q) {
          item.google_query.map((item) => {
            let url=new URL(item.url)
            url=`${url.origin}${url.path}`
            google_query_url.add(item.url);
          });
          item.google_news_query.map((item) => {
            let url=new URL(item.url)
            url=`${url.origin}${url.path}`
            google_query_news_url.add(item.url);
          });
        }
      });
    });
    google_query_url = Array.from(google_query_url);
    for (const item of google_query_url) {
      let count = await dataModel.countDocuments({
        "query.google_query.url": item,
      });
      google_url_count.push({ url: item, count });
    }
    google_query_news_url = Array.from(google_query_news_url);
    for (const item of google_query_news_url) {
      let count = await dataModel.countDocuments({
        "query.google_news_query.url": item,
      });
      google_news_url_count.push({ url: item, count });
    }
    google_url_count.sort((a, b) => b.count - a.count);
    google_news_url_count.sort((a, b) => b.count - a.count);
    res.send({ google: google_url_count, google_news: google_news_url_count });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
const getSummary = async (req, res) => {
  try {
    const { q } = req.query
    let findInGoogle_news_query = false;
    let data = await dataModel.find(
      { "query.google_query.url": q },
      "location -_id plugin_id language date"
    );
    if (data.length === 0) {
      data = await dataModel.find(
        { "query.google_news_query.url": q },
        "location -_id plugin_id language date"
      )
      findInGoogle_news_query = true;
    }
    //summary for location
    const locationArray = new Set();
    const locationArraySummary = [];
    data.map((item) => {
      locationArray.add(item.location);
    });
    for (const item of locationArray) {
      let count;
      if (findInGoogle_news_query) {
        count = await dataModel
          .find({ 'query.google_news_query.url': q, 'location': item })
          .countDocuments();
      } else {
        count = await dataModel
          .find({ 'query.google_query.url': q, 'location': item })
          .countDocuments();
      }
      locationArraySummary.push({ location: item, count });
    }
    //summary for plugin_id
    const plugin_idArray = new Set();
    const plugin_idArraySummary = [];
    data.map((item) => {
      plugin_idArray.add(item.plugin_id);
    });
    for (const item of plugin_idArray) {
      let count
      if (findInGoogle_news_query) {
        count = await dataModel
          .find({ "query.google_news_query.url": q, 'plugin_id': item })
          .countDocuments();
      } else {
        count = await dataModel
          .find({ "query.google_query.url": q, 'plugin_id': item })
          .countDocuments();
      }
      plugin_idArraySummary.push({ plugin_id: item, count });
    }
    //summary for language
    const languageArray = new Set();
    const languageArraySummary = [];
    data.map((item) => {
      languageArray.add(item.language);
    });
    for (const item of languageArray) {
      let count
      if (findInGoogle_news_query) {
        count = await dataModel
          .find({ 'query.google_news_query.url': q, 'language': item })
          .countDocuments();
      } else {
        count = await dataModel
          .find({ 'query.google_query.url': q, 'language': item })
          .countDocuments();
      }
      languageArraySummary.push({ language: item, count });
    }
    //summary for date
    const dateArray = new Set();
    const dateArraySummary = [];
    data.map((item) => {
      dateArray.add(item.date);
    });
    for (const item of dateArray) {
      let count
      if (findInGoogle_news_query) {
        count = await dataModel
          .find({ "query.google_news_query.url": q, 'date': item })
          .countDocuments();
      } else {
        count = await dataModel
          .find({ "query.google_query.url": q, 'date': item })
          .countDocuments();
      }
      dateArraySummary.push({ date: item, count });
    }
    //sorting data
    locationArraySummary.sort((a, b) => b.count - a.count);
    plugin_idArraySummary.sort((a, b) => b.count - a.count);
    languageArraySummary.sort((a, b) => b.count - a.count);
    dateArraySummary.sort((a, b) => b.count - a.count);
    res.send({
      locationArraySummary,
      plugin_idArraySummary,
      languageArraySummary,
      dateArraySummary,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
module.exports = {
  addData,
  filterData,
  deleteAll,
  getCommonData,
  getSummary,
};
