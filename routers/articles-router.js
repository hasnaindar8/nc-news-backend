const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  addCommentForArticle,
  updateArticle,
  addArticle,
} = require("../controllers/articles.controller.js");

const express = require("express");
const articlesRouter = express.Router();

articlesRouter.route("/").get(getArticles).post(addArticle);

articlesRouter.route("/:article_id").get(getArticleById).patch(updateArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(addCommentForArticle);

module.exports = articlesRouter;
