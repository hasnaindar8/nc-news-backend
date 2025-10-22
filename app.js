const { getTopics } = require("./controllers/topicsController.js");
const {
  getArticles,
  getArticleById,
} = require("./controllers/articlesController.js");
const { getUsers } = require("./controllers/usersController.js");
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

module.exports = app;
