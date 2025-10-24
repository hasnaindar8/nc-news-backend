const db = require("../db/connection.js");

async function getAllArticles(queries) {
  const { sort_by = "created_at", order = "desc", topic } = queries;
  const validSortColumns = [
    "created_at",
    "article_id",
    "votes",
    "comment_count",
    "author",
    "title",
    "topic",
  ];
  const validOrderValues = ["asc", "desc"];

  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }

  if (!validOrderValues.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }
  const values = [];
  let query = `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, count(c.comment_id)::INT AS comment_count FROM articles AS a LEFT JOIN comments AS c ON a.article_id = c.article_id`;

  if (topic) {
    query += ` WHERE a.topic = $1`;
    values.push(topic);
  }

  query += ` GROUP BY a.article_id ORDER BY a.${sort_by} ${order};`;
  const { rows: articles } = await db.query(query, values);
  return articles;
}

async function getArticleUsingId(articleId) {
  const { rows } = await db.query(
    `SELECT a.article_id,
       a.author,
       a.title,
       a.body,
       a.topic,
       a.created_at,
       a.votes,
       a.article_img_url, 
       COUNT(c.comment_id)::INT AS comment_count 
       FROM articles AS a LEFT JOIN comments AS c ON a.article_id = c.article_id 
       WHERE a.article_id = $1 
       GROUP BY a.article_id`,
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
      return rows;
    });
}

async function checkArticleExistsById(articleId) {
  const { rows } = await db.query(
    `SELECT article_id FROM articles WHERE article_id = $1`,
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
  checkArticleExistsById,
};
