const { getAllTopics } = require("../models/topicsModel.js");

async function getTopics(req, res) {
  const topics = await getAllTopics();
  res.send({ topics });
}

module.exports = { getTopics };
