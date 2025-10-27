const db = require("../db/connection.js");

async function deleteCommentById(commentId) {
  const { rowCount } = await db.query(
    `DELETE FROM comments WHERE comment_id = $1`,
    [commentId]
  );
  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      msg: `No comment found to delete with comment_id: ${commentId}`,
    });
  }
  return rowCount;
}

module.exports = { deleteCommentById };
