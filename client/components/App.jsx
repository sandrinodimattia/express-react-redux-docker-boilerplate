import './App.css';
import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';

import { connectContainer } from '../utils';
export default connectContainer(class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  render() {
    return (
      <div>
        <IndexLink to="/">Home</IndexLink>
        {' | '}
        <Link to="/about">About</Link>
        <br />
        {this.props.children}
      </div>
    );
  }
}
