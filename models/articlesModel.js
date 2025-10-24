const db = require("../db/connection.js");
const { format } = require("node-pg-format");

async function getAllArticles(queries) {
  const { sort_by = "created_at", order = "desc" } = queries;
  const query = format(
    `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, count(c.comment_id)::INT AS comment_count FROM articles AS a LEFT JOIN comments AS c ON a.article_id = c.article_id GROUP BY a.article_id ORDER BY a.%s %s;`,
    sort_by,
    order
  );
  const { rows: articles } = await db.query(query);
  return articles;
}

async function getArticleUsingId(articleId) {
  const { rows } = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [articleId]
  );
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No article found for article_id: ${articleId}`,
    });
  }
  return rows[0];
}

function getCommentsUsingArticleId(articleId) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for article_id: ${articleId}`,
        });
      }
      return rows;
    });
}

async function addCommentAgainstArticle(articleId, requestBody) {
  const { username, body } = requestBody;
  const { rows } = await db.query(
    `INSERT INTO comments(body, article_id, author, votes, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
    [body, articleId, username, 0]
  );
  return rows[0];
}

function updateArticleUsingId(articleId, requestBody) {
  const { inc_votes } = requestBody;
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`,
        });
      }
      return rows[0];
    });
}

module.exports = {
  getAllArticles,
  getArticleUsingId,
  getCommentsUsingArticleId,
  addCommentAgainstArticle,
  updateArticleUsingId,
};
