const path = require('path');
const {merge} = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const config = {
  mode: 'development',
  // Tell webpack the root file
  entry: './src/client/client.js',

  // Tell webpack where to put the output file
  // that is generated
  output: {
    filename: 'assets/bundle.js',
    path: path.resolve(__dirname, 'public'),
    sourceMapFilename: 'sourceMap/[file].map',
    publicPath: '/static/'
  },

  devtool: 'eval-cheap-source-map'
  };

module.exports = merge(baseConfig, config);
