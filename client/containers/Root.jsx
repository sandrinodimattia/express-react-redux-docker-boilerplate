import React, { PropTypes } from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';

export default class Root extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired
  };

  render() {
    const { store, history, routes } = this.props;
    if (!this.routes) {
      this.routes = routes;
    }

    return (
      <Provider store={store}>
        <Router history={history} routes={this.routes} />
      </Provider>
    );
  }
}
