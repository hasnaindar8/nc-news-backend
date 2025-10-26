const db = require("../db/connection.js");

async function fetchAllUsers() {
  const { rows: users } = await db.query("SELECT * FROM users;");
  return users;
}

async function fetchUserByUsername(username) {
  const { rows } = await db.query("SELECT * FROM users WHERE username = $1;", [
    username,
  ]);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `No user found for username: ${username}`,
    });
  }
  return rows[0];
}

module.exports = { fetchAllUsers, fetchUserByUsername };
