const {
  getAllArticles,
  getArticleUsingId,
  getCommentsUsingArticleId,
  addCommentAgainstArticle,
  updateArticleUsingId,
  checkArticleExistsById,
  insertArticle,
} = require("../models/articles.model.js");

const { checkTopicExists } = require("../models/topics.model.js");

async function getArticles(req, res) {
  const queries = req.query;
  const articles = await getAllArticles(queries);
  if (articles.length === 0 && queries.topic) {
    const topicExists = await checkTopicExists(queries.topic);
    if (!topicExists) {
      return Promise.reject({
        status: 404,
        msg: `No topic found for topic: ${queries.topic}`,
      });
    }
  }
  res.status(200).send({ articles });
}

async function getArticleById(req, res) {
  const { article_id } = req.params;
  const article = await getArticleUsingId(article_id);
  res.status(200).send({ article });
}

async function getCommentsByArticleId(req, res) {
  const { article_id } = req.params;
  await checkArticleExistsById(article_id);
  const comments = await getCommentsUsingArticleId(article_id);
  res.status(200).send({ comments });
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

async function addArticle(req, res) {
  const requestBody = req.body;
  const article = await insertArticle(requestBody);
  res.status(201).send({ article });
}

module.exports = {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  addCommentForArticle,
  updateArticle,
  addArticle,
};
