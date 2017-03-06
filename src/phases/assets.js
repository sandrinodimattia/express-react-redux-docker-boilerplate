const path = require('path');
const express = require('express');
const assetsResolver = require('express-webpack-assets');

module.exports = function phase(done) {
  this.use('/static', express.static(path.join(__dirname, '../../public/')));

  // In production, expose the dist folder.
  if (process.env.NODE_ENV === 'production') {
    this.use('/assets', express.static(path.join(__dirname, '../../dist/'), { maxAge: '1y' }));
  }

  // Inject the assets in the current locals.
  this.use(assetsResolver(path.join(__dirname, '../../dist/assets.json'), {
    devMode: process.env.NODE_ENV !== 'production'
  }));

  done();
};
