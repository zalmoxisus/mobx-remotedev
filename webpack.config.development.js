'use strict';

var webpack = require('webpack');
var baseConfig = require('./webpack.config.base');
var merge = require('webpack-merge');

var devConfig = {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  output: {
    filename: 'mobx-remotedev.js'
  }
};

module.exports = merge(baseConfig, devConfig);
