import chalk from 'chalk';
import webpack from 'webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

import paths from '../paths';
import baseConfig from './base';
import { createLogger } from '../utils/logger';

const logger = createLogger('webpack-build');

const config = baseConfig({
  debug: true,
  verbose: true,
  publicPath: 'http://localhost:3001/assets/',
  browsersList: [
    '>1%',
    'last 4 versions',
    'Firefox ESR',
    'not ie < 9'
  ],
});

module.exports = {
  ...config,

  devtool: 'cheap-module-source-map',

  entry: {
    ...config.entry,
    client: [
      // activate HMR for React
      'react-hot-loader/patch',

      // bundle the client for webpack-dev-server
      // and connect to the provided endpoint
      'webpack-dev-server/client?http://localhost:3001',

      // bundle the client for hot reloading
      // only- means to only hot reload for successful updates
      'webpack/hot/only-dev-server',

      paths.clientEntryPoint
    ],
  },

  plugins: [
    ...config.plugins,

    // Progress bar.
    new ProgressBarPlugin({
      summary: false,
      format: `[${new Date().toISOString()}] Webpack build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
      customSummary: buildTime => logger.debug(`Webpack build completed in ${buildTime}`)
    }),

    // Write the name of the updated module to log during hot reloads.
    new webpack.NamedModulesPlugin(),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    // Only emit files when there are no errors
    new webpack.NoEmitOnErrorsPlugin(),

    // Hot reload support.
    new webpack.HotModuleReplacementPlugin()
  ]
};
