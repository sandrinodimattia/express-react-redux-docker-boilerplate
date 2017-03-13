import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';

import Root from './containers/Root';
import routes from './routes';
import configureStore from './store';

// Redux initialization.
const store = configureStore([routerMiddleware(browserHistory)]);
const history = syncHistoryWithStore(browserHistory, store);

// Render teh application.
render(
  <Root routes={routes} store={store} history={history} />,
  document.getElementById('app')
);

// Support for hot reloading.
if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./routes', () => {
      System.import('./routes')
        .then((routesModule) => {
          render(
            <Root routes={routesModule} store={store} history={history} />,
            document.getElementById('app')
          );
        });
    });
  }
}
