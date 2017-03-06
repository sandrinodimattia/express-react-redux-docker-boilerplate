const path = require('path');

module.exports = function phase(done) {
  this.set('views', path.join(__dirname, '../views'));
  this.set('view engine', 'pug');

  done();
};
