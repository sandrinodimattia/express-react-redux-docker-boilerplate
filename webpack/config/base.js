import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import paths from '../paths';

export default ({ publicPath, verbose, debug, browsersList, plugins = [] }) => ({
  name: 'client',

  target: 'web',

  context: paths.root,

  bail: !debug,

  cache: debug,

  stats: {
    colors: true,
    reasons: debug,
    hash: verbose,
    version: verbose,
    timings: true,
    chunks: verbose,
    chunkModules: verbose,
    cached: verbose,
    cachedAssets: verbose,
  },

  entry: {
    vendors: [
      'bluebird',
      'react',
      'react-dom',
      'react-redux',
      'redux',
      'redux-form',
      'redux-thunk',
      'redux-logger',
      'redux-promise-middleware'
    ]
  },

  output: {
    path: paths.output,
    publicPath,
    pathinfo: verbose || false,
    filename: debug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: debug ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js'
  },

  resolve: {
    extensions: [
      '.json',
      '.js',
      '.jsx'
    ]
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          paths.client,
        ],
        query: {
          // https://github.com/babel/babel-loader#options
          cacheDirectory: debug,

          // https://babeljs.io/docs/usage/options/
          babelrc: false,

          presets: [
            // A Babel preset that can automatically determine the Babel plugins and polyfills
            // https://github.com/babel/babel-preset-env
            [
              'env',
              {
                targets: {
                  browsers: browsersList,
                },
                useBuiltIns: false,
                debug: false,
              }
            ],

            // Experimental ECMAScript proposals
            // https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-
            'stage-2',

            // JSX, Flow
            // https://github.com/babel/babel/tree/master/packages/babel-preset-react
            'react',

            // Optimize React code for the production build
            // https://github.com/thejameskyle/babel-react-optimize
            ...debug ? [] : ['react-optimize'],
          ],
          plugins: [
            'transform-export-extensions',

            // Adds component stack to warning messages
            // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source
            ...debug ? ['transform-react-jsx-source'] : [],

            // Adds __self attribute to JSX which React will use for some warnings
            // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-self
            ...debug ? ['transform-react-jsx-self'] : [],
          ],
        },
      },
      {
        test: /\.css/,
        use: debug ?
        [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              // CSS Loader https://github.com/webpack/css-loader
              importLoaders: 1,
              sourceMap: debug,

              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: debug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',

              // CSS Nano http://cssnano.co/options/
              minimize: !debug,
              discardComments: { removeAll: true },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: path.join(__dirname, './postcss.config.js'),
            },
          },
        ]
        :
        ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                // CSS Loader https://github.com/webpack/css-loader
                importLoaders: 1,
                sourceMap: debug,

                // CSS Modules https://github.com/css-modules/css-modules
                modules: true,
                localIdentName: debug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',

                // CSS Nano http://cssnano.co/options/
                minimize: !debug,
                discardComments: { removeAll: true },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                config: path.join(__dirname, './postcss.config.js'),
              },
            }
          ]
        })
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: debug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          name: debug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]',
          limit: 10000,
        },
      },
    ],
  },

  // Default plugins.
  plugins: [
    ...plugins,

      // Assign the module and chunk ids by occurrence count
      // Consistent ordering of modules required if using any hashing ([hash] or [chunkhash])
      // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
    new webpack.optimize.OccurrenceOrderPlugin(true),

    // CSS in a separate file.
    ...debug ? [] : [new ExtractTextPlugin({ filename: '[name].[hash].css', allChunks: true })],

    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': debug ? '"development"' : '"production"',
      'process.env.BROWSER': true,
      __DEV__: debug,
    }),

    // Emit a file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options
    new AssetsPlugin({
      path: paths.output,
      filename: 'assets.json',
      prettyPrint: true,
    }),

    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    // http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: module => /node_modules/.test(module.resource),
    })
  ],

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.github.io/docs/configuration.html#node
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }
});
