const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      'fs': false,
      'tls': false,
      'net': false,
      'path': false,
      'zlib': false,
      'http': false,
      'https': false,
      'stream': false,
      'crypto': false,
      'crypto-browserify': false
    }
  },
  plugins: [
    // copy the assets for the template onto server/public
    new CopyWebpackPlugin({
      patterns:[
        { from:'./node_modules/govuk_template_mustache/assets/stylesheets', to:'./assets/' },
        { from:'./node_modules/govuk_template_mustache/assets/images', to:'./assets/images' },
        { from:'./node_modules/react-datepicker/dist/react-datepicker.css', to:'./assets/css' },
        { from:'./node_modules/react-polyfill/dist/react-polyfill.min.js', to:'./assets/js' },
        { from:'./node_modules/react-polyfill/dist/react-polyfill.min.js.map', to:'./assets/js' },
        { from: './docs', to: './assets/docs'},
        { from: './assets/images/calendar.png', to: './assets/images/calendar.png'}
      ]
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new MiniCssExtractPlugin({
      filename: 'assets/fancythat.css',
    }),
  ],
  module: {
    rules: [
      {
        test:/\.(s*)css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        },
        'css-loader', 'sass-loader'
        ],
      },
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          'presets': [['@babel/preset-env', {
            'targets': {
              browsers: ['last 2 versions', 'ie >= 11']
            }
          }], '@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-class-properties', ['@babel/plugin-transform-runtime',
            {
              'regenerator': true
            }
          ]]
        }
      },
      {
        test: /\.(pdf)(\?.*)?$/,
        loader: 'url-loader',
        options: {}
      }
    ]
  }
};
