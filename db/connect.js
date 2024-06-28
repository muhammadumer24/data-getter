const mongo = require("mongoose");

const cnt = async (url) => {
  try {
    await mongo.connect(url);
  } catch (error) {
    console.log("Connection Error", error);
  }
};
module.exports = cnt;
