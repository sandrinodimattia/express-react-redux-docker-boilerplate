import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';

import paths from '../paths';
import baseConfig from './base';

const config = baseConfig({
  debug: false,
  verbose: true,
  publicPath: '/assets/',
  browsersList: [
    '>1%',
    'last 4 versions',
    'Firefox ESR',
    'not ie < 9'
  ],
});

module.exports = {
  ...config,

  devtool: false,

  entry: {
    ...config.entry,
    client: [
      'babel-polyfill',
      paths.clientEntryPoint
    ],
  },

  plugins: [
    ...config.plugins,

    // A plugin for a more aggressive chunk merging strategy
    // https://webpack.github.io/docs/list-of-plugins.html#aggressivemergingplugin
    new webpack.optimize.AggressiveMergingPlugin(),

    // Minimize all JavaScript output of chunks
    // https://github.com/mishoo/UglifyJS2#compressor-options
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false,
        unused: true,
        dead_code: true,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),

    // Build compressed files.
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};
