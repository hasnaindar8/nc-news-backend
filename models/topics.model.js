const db = require("../db/connection.js");

async function getAllTopics() {
  const { rows: topics } = await db.query(
    "SELECT slug, description FROM topics;"
  );
  return topics;
}

async function checkTopicExists(topic) {
  const { rows } = await db.query(`SELECT * FROM topics WHERE slug = $1`, [
    topic,
  ]);
  return rows.length > 0;
}

module.exports = { getAllTopics, checkTopicExists };
