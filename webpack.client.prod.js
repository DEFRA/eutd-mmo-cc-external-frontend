const path = require('path');
const {merge} = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const TerserPlugin = require('terser-webpack-plugin');


const config = {
  mode: 'production',
  devtool: 'source-map',
  // Tell webpack the root file of our
  // server application
  entry: './src/client/client.js',

  // Tell webpack where to put the output file
  // that is generated
  output: {
    filename: 'assets/bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/static/'
  },
  optimization: {
    minimizer: [
      // we specify a custom TerserPlugin here to get source maps in production
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: true,
          ecma: 6,
          mangle: true
        }
      })
    ]
  },

};

module.exports = merge(baseConfig, config);
