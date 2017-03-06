import React from 'react';
import Helmet from 'react-helmet';

export default class About extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="About" />
        <p>About page!</p>
      </div>
    );
  }
}
