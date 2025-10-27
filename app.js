const { getTopics } = require("./controllers/topics.controller.js");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  addCommentForArticle,
  updateArticle,
} = require("./controllers/articles.controller.js");
const {
  getUsers,
  getUserByUsername,
} = require("./controllers/users.controller.js");
const {
  customErrorHandler,
  psqlErrorHandler,
  serverErrorHandler,
} = require("./middleware/errorHandler.js");
const { deleteComment } = require("./controllers/comments.controller.js");
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

app.get("/api/users/:username", getUserByUsername);

app.use((req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(customErrorHandler);

app.use(psqlErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
