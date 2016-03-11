/* eslint-disable max-len */

import path from 'path';

import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import webpackIsomorphicToolsConfig from './webpack-isomorphic-tools';

import config from './index';

const APP_NAME = config.get('currentApp');

export default {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  progress: true,
  entry: {
    main: [
      `./${APP_NAME}/client`,
    ],
  },
  output: {
    path: path.join(__dirname, '../../dist'),
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel'],
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true'),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/webpack\.dev/, /\/babel$/),
    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig),
  ],
  resolve: {
    root: [
      path.resolve('../src'),
    ],
    modulesDirectories: ['node_modules', 'src'],
    extensions: ['', '.js', '.jsx'],
  },
};