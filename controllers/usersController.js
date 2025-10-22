const { getAllUsers } = require("../models/usersModel.js");

async function getUsers(req, res) {
  const users = await getAllUsers();
  res.status(200).send({ users });
}

module.exports = { getUsers };
