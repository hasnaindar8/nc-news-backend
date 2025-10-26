const {
  fetchAllUsers,
  fetchUserByUsername,
} = require("../models/usersModel.js");

async function getUsers(req, res) {
  const users = await fetchAllUsers();
  res.status(200).send({ users });
}

async function getUserByUsername(req, res) {
  const { username } = req.params;
  const user = await fetchUserByUsername(username);
  res.status(200).send({ user });
}

module.exports = { getUsers, getUserByUsername };
