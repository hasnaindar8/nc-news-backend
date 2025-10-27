const {
  deleteCommentById,
  updateCommentById,
} = require("../models/comments.model.js");

async function deleteComment(req, res) {
  const { comment_id } = req.params;
  await deleteCommentById(comment_id);
  res.status(204).send();
}

async function updateComment(req, res) {
  const { comment_id } = req.params;
  const requestBody = req.body;
  const comment = await updateCommentById(comment_id, requestBody);
  res.status(200).send({ comment });
}

module.exports = { deleteComment, updateComment };
