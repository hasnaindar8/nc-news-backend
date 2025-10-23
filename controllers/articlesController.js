const {
  getAllArticles,
  getArticleUsingId,
  getCommentsUsingArticleId,
  addCommentAgainstArticle,
  updateArticleUsingId,
} = require("../models/articlesModel.js");

async function getArticles(req, res) {
  const articles = await getAllArticles();
  res.status(200).send({ articles });
}

async function getArticleById(req, res) {
  const { article_id } = req.params;
  const article = await getArticleUsingId(article_id);
  res.status(200).send({ article });
}

function getCommentsByArticleId(req, res) {
  const { article_id } = req.params;
  return getCommentsUsingArticleId(article_id).then((comments) => {
    res.status(200).send({ comments });
  });
}

async function addCommentForArticle(req, res) {
  const { article_id } = req.params;
  const requestBody = req.body;
  const comment = await addCommentAgainstArticle(article_id, requestBody);
  res.status(201).send({ comment });
}

async function updateArticle(req, res) {
  const { article_id } = req.params;
  const requestBody = req.body;
  const article = await updateArticleUsingId(article_id, requestBody);
  res.status(200).send({ article });
}

module.exports = {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  addCommentForArticle,
  updateArticle,
};
