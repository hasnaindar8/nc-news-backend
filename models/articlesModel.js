const db = require("../db/connection.js");

async function getAllArticles() {
  const { rows: articles } = await db.query(
    `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, count(c.comment_id) AS comment_count FROM articles AS a JOIN comments AS c ON a.article_id = c.article_id GROUP BY a.article_id ORDER BY a.created_at DESC;`
  );
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

module.exports = {
  getAllArticles,
  getArticleUsingId,
  getCommentsUsingArticleId,
};
