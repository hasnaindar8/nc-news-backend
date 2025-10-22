const db = require("../db/connection.js");

async function getAllTopics() {
  const { rows: topics } = await db.query(
    "SELECT slug, description FROM topics;"
  );
  return topics;
}

module.exports = { getAllTopics };
