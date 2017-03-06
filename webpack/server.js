import opn from 'opn';
import morgan from 'morgan';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import server from '../src/server';
import logger from '../src/lib/logger';
import config from './config/development';

const devServer = new WebpackDevServer(webpack(config), {
  setup(app) {
    app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
      stream: {
        write: (message) => {
          logger.debug(message.replace(/\n$/, ''));
        }
      }
    }));
  },
  publicPath: config.output.publicPath,
  hot: true,
  inline: true,
  historyApiFallback: true,
  proxy: {
    '/': 'http://127.0.0.1:3000',
  },

  quiet: false,
  noInfo: true,
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});

const port = process.env.PORT || 3001;
devServer.listen(port, 'localhost', (err) => {
  if (err) {
    logger.error(err, 'Error booting development server');
    process.exit(1);
  } else {
    logger.info(`Development server listening on: http://localhost:${port}`);

    // Start the actual webserver.
    server.boot((serverError) => {
      if (serverError) {
        logger.error(serverError, 'Error booting server');
        process.exit(1);
      }
    });
  }
});
