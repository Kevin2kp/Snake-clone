const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'app', 'snak.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'snak.js',
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'app'),
    ],
  },
  devtool: 'inline-source-map',
  context: __dirname,
  target: 'web',
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Snak',
      myPageHeader: 'Snak',
      template: path.resolve(__dirname, 'app', 'index.html'),
      filename: path.resolve(__dirname, 'dist', 'index.html'), //relative to root of the application
    }),
  ],
};