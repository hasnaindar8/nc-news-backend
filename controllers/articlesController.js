const { getAllArticles } = require("../models/articlesModel.js");

async function getArticles(req, res) {
  const articles = await getAllArticles();
  res.status(200).send({ articles });
}

module.exports = { getArticles };
