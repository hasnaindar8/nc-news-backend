const topicsRouter = require("./routers/topics-router.js");
const articlesRouter = require("./routers/articles-router.js");
const usersRouter = require("./routers/users-router.js");
const commentsRouter = require("./routers/comments-router.js");
const {
  customErrorHandler,
  psqlErrorHandler,
  serverErrorHandler,
} = require("./middleware/errorHandler.js");
const { notFoundHandler } = require("./middleware/notFoundHandler.js");

const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.static(`${__dirname}/public`));

app.use("/api", express.static(`${__dirname}/public/index.html`));

app.use(express.json());

app.use("/api/topics", topicsRouter);

app.use("/api/articles", articlesRouter);

app.use("/api/users", usersRouter);

app.use("/api/comments", commentsRouter);

app.use(notFoundHandler);

app.use(customErrorHandler);

app.use(psqlErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
