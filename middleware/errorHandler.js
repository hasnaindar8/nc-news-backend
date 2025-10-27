exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.psqlErrorHandler = (err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      res.status(400).send({ msg: "Bad Request" });
      break;
    case "23503":
      res.status(409).send({ msg: "Referenced record does not exist" });
      break;
    case "23502":
      res.status(400).send({ msg: "Bad Request" });
      break;
    case "42601":
      res.status(400).send({ msg: "Bad Request" });
      break;
    case "42703":
      res.status(400).send({ msg: "Bad Request" });
      break;
    default:
      next(err);
  }
};

exports.serverErrorHandler = (err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).send({ msg: "Internal Server Error" });
};
