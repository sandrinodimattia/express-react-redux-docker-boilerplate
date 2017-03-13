import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Home from './containers/Home';
import * as components from './components';

const errorLoading = (err) => {
  console.error('Page load failed!', err); // eslint-disable-line no-console
};

const loadModule = cb => (componentModule) => {
  cb(null, componentModule.default);
  console.log('Load complete!'); // eslint-disable-line no-console
};

module.exports = (
  <Route path="/" component={components.App}>
    <IndexRoute component={Home} />
    <Route
      path="about" getComponent={(location, callback) => {
        console.log('Loading route...'); // eslint-disable-line no-console
        const renderRoute = loadModule(callback);
        require.ensure([], require => Promise.resolve(require('./components/About'))
          .then(renderRoute)
          .catch(errorLoading));
      }}
    />
    <Route path="*" component={components.NotFound} />
  </Route>
);
