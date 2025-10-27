const {
  getUsers,
  getUserByUsername,
} = require("../controllers/users.controller.js");

const express = require("express");
const usersRouter = express.Router();

usersRouter.route("/").get(getUsers);

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
