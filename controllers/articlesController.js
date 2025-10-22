const {
  getAllArticles,
  getArticleUsingId,
} = require("../models/articlesModel.js");

async function getArticles(req, res) {
  const articles = await getAllArticles();
  res.status(200).send({ articles });
}

async function getArticleById(req, res) {
  const { article_id } = req.params;
  const article = await getArticleUsingId(article_id);
  if (article === undefined) {
    res.status(404).send({ statusCode: 404, error: "Article Not Found" });
  } else {
    res.status(200).send({ article });
  }
}

module.exports = { getArticles, getArticleById };
