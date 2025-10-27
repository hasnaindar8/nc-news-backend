const { deleteCommentById } = require("../models/comments.model.js");

async function deleteComment(req, res) {
  const { comment_id } = req.params;
  await deleteCommentById(comment_id);
  res.status(204).send();
}

module.exports = { deleteComment };
