const db = require("../db/connection.js");

async function getAllArticles() {
  const { rows: articles } = await db.query(
    `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, count(c.comment_id) AS comment_count FROM articles AS a JOIN comments AS c ON a.article_id = c.article_id GROUP BY a.article_id ORDER BY a.created_at DESC;`
  );
  return articles;
}

module.exports = { getAllArticles };
