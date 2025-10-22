const { getTopics } = require("./controllers/topicsController.js");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/getHealth", (req, res) => {
  res.status(200).send({ health: "Server is up and running" });
});

app.get("/api/topics", getTopics);

module.exports = app;
