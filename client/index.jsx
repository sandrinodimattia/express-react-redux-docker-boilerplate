import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';

import routes from './routes';
import configureStore from './store';

// Redux initialization.
const store = configureStore([routerMiddleware(browserHistory)]);
const history = syncHistoryWithStore(browserHistory, store);

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>, document.getElementById('app')
  );
};

render();

// Support for hot reloading.
if (module.hot) {
  module.hot.accept('./routes', () => {
    render();
  });
}
