import Helmet from 'react-helmet';
import React, { Component } from 'react';

import { Home } from '../components';
import { connectContainer } from '../utils';
import * as quoteActions from '../actions/quotes';

export default connectContainer(class HomeContainer extends Component {
  static stateToProps = state => ({
    quotes: state.quotes
  });

  static actionsToProps = {
    getQuote: quoteActions.getQuote
  }

  render() {
    return (
      <div>
        <Helmet title="Insurance Zero" />
        <Home {...this.props} />
      </div>
    );
  }
});
