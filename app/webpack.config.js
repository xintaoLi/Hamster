const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: [
    "babel-polyfill",
    "./src/index.js"
  ],
  output: {
    path: path.resolve(__dirname, '../www/js/'),
    publicPath: "/output/",
    filename: '[hash].bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015', 'stage-3', 'react']
        }
      }, {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'), {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          }
        ],
      }
    ]
  }
};