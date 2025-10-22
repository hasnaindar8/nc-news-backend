const db = require("../db/connection.js");

async function getAllUsers() {
  const { rows: users } = await db.query("SELECT * FROM users;");
  return users;
}

module.exports = { getAllUsers };
