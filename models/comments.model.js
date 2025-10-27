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

async function updateCommentById(commentId, requestBody) {
  const { inc_votes } = requestBody;
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const { rows } = await db.query(
    `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
    [inc_votes, commentId]
  );

  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No comment found for comment_id: ${commentId}`,
    });
  }
  return rows[0];
}

module.exports = { deleteCommentById, updateCommentById };
