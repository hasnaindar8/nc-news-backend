const db = require("./connection.js");

function getAllUsers() {
  return db.query("SELECT * FROM users;");
}

function getAllArticlesByTopic(topic) {
  return db.query("SELECT * FROM articles WHERE topic = $1", [topic]);
}

function getAllCommentsByVotesLessThanZero() {
  return db.query("SELECT * FROM comments WHERE votes < 0");
}

function getAllTopics() {
  return db.query("SELECT * FROM topics;");
}

function getAllArticlesByUser(username) {
  return db.query("SELECT * FROM articles Where author = $1;", [username]);
}

function getAllCommentsByVotesMorethanTen() {
  return db.query("SELECT * FROM comments WHERE votes > 10");
}

module.exports = {
  getAllUsers,
  getAllArticlesByTopic,
  getAllCommentsByVotesLessThanZero,
  getAllTopics,
  getAllArticlesByUser,
  getAllCommentsByVotesMorethanTen,
};
