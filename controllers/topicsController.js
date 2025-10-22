const { getAllTopics } = require("../models/topicsModel.js");

async function getTopics(req, res) {
  const topics = await getAllTopics();
  res.status(200).send({ topics });
}

module.exports = { getTopics };
