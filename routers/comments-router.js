const { deleteComment } = require("../controllers/comments.controller.js");

const express = require("express");
const commentsRouter = express.Router();

commentsRouter.route("/:comment_id").delete(deleteComment);

module.exports = commentsRouter;
