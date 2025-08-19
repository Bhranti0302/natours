const path = require('path');

module.exports = {
  entry: './public/js/index.js', // entry file
  output: {
    filename: 'bundle.js', // output file
    path: path.resolve(__dirname, 'public/js'),
  },
  mode: 'development', // change to 'production' when deploying
  module: {
    rules: [
      {
        test: /\.js$/, // transpile modern JS
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // make sure babel-loader is installed
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
