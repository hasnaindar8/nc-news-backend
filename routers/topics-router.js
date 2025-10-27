const { getTopics } = require("../controllers/topics.controller");

const express = require("express");
const topicsRouter = express.Router();

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
