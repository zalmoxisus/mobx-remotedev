'use strict';

var webpack = require('webpack');
var baseConfig = require('./webpack.config.base');
const TerserPlugin = require('terser-webpack-plugin');
var merge = require('webpack-merge');

var prodConfig = {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        // cache: true,
        parallel: true,
        terserOptions: {
          // keep function names for Mobx Injection
          keep_fnames: true
        }
      })
    ]
  },
  output: {
    filename: 'mobx-remotedev.min.js'
  }
};

module.exports = merge(baseConfig, prodConfig);
