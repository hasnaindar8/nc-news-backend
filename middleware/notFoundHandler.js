exports.notFoundHandler = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};
