import React from 'react';
import { Route, IndexRoute } from 'react-router';

import * as components from './components';

export default (
  <Route path="/" component={components.App}>
    <IndexRoute component={components.Home} />
    <Route path="about" component={components.About} />
    <Route path="*" component={components.NotFound} />
  </Route>
);
