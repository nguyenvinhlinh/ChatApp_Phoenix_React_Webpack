path = require("path");
module.exports = {
  context: path.join(__dirname, "webpack_src"),
  entry: {
    app: "./js/app.js"
  },
  output: {
    path: path.join(__dirname, "priv/static/js"),
    filename: "[name].js"
  }
}