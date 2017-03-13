import url from 'url';
import once from 'once';
import morgan from 'morgan';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import config from './config/development';
import { createLogger, watch } from './utils';

const logger = createLogger('webpack-dev-server');

const compiler = webpack(config);
const devServer = new WebpackDevServer(compiler, {
  setup(app) {
    app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
      skip(req) {
        return req.url.indexOf(url.parse(config.output.publicPath).pathname) < 0;
      },
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

compiler.plugin('done', once(() => {
  const port = process.env.PORT || 3001;
  devServer.listen(port, 'localhost', (err) => {
    if (err) {
      logger.error(err, 'Error booting development server');
      process.exit(1);
    } else {
      logger.debug(`Development server listening on: http://localhost:${port}`);

      // Start the actual server.
      watch({
        script: './src/server.js',
        watch: './src'
      });
    }
  });
}));
