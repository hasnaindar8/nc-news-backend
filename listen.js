const app = require("./app.js");

const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
