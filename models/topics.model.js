const db = require("../db/connection.js");

async function getAllTopics() {
  const { rows: topics } = await db.query(
    "SELECT t.slug, t.description FROM topics AS t;"
  );
  return topics;
}

async function checkTopicExists(topic) {
  const { rows } = await db.query(`SELECT t.* FROM topics AS t WHERE slug = $1`, [
    topic,
  ]);
  return rows.length > 0;
}

module.exports = { getAllTopics, checkTopicExists };
