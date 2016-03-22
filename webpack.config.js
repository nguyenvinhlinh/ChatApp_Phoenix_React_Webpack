path = require("path");
module.exports = {
  context: path.join(__dirname, "webpack_src"),
  entry: {
    app: "./js/app.js",
    chat: "./js/chat.jsx",
    chat2: "./js/chat2.jsx"
  },
  output: {
    path: path.join(__dirname, "priv/static/js"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference 
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
}