const { getTopics } = require("./controllers/topicsController.js");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  addCommentForArticle,
  updateArticle,
} = require("./controllers/articlesController.js");
const { getUsers } = require("./controllers/usersController.js");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./controllers/errorHandlerController.js");
const { deleteComment } = require("./controllers/commentsController.js");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/getHealth", (req, res) => {
  res.status(200).send({ health: "Server is up and running" });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", addCommentForArticle);

app.patch("/api/articles/:article_id", updateArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
