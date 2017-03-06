const path = require('path');
const bootable = require('bootable');

module.exports = (app, cwd) => {
  const server = bootable(app);

  return {
    phase: (filename) => {
      server.phase(require(path.join(cwd, filename)));
    },
    boot: (cb) => {
      server.boot((err) => {
        cb(err, app);
      });
    }
  };
};
