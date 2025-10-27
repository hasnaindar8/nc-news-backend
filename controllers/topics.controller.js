const { getAllTopics } = require("../models/topics.model.js");

async function getTopics(req, res) {
  const topics = await getAllTopics();
  res.status(200).send({ topics });
}

module.exports = { getTopics };
