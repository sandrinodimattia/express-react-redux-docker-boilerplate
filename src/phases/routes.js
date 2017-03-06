module.exports = function phase() {
  this.get('*', (req, res) => {
    res.render('index', {
      title: 'My App',
      style: {
        client: res.locals.webpack_asset('client').css
      },
      scripts: {
        client: res.locals.webpack_asset('client').js,
        vendor: (res.locals.webpack_asset('vendors') && res.locals.webpack_asset('vendors').js) || null
      }
    });
  });
};
