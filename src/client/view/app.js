import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetch } from '../action/user';
import { loadList } from '../action/device';

import ProgressBar from '../container/progressBar';
import ErrorOverlay from '../container/errorOverlay';

class App extends Component {
  componentWillMount() {
    this.props.fetch();
    this.props.loadList();
  }
  render() {
    // Just a mockup..
    return (
      <div id='app'>
        <div className='app-wrapper'>
          {this.props.children}
        </div>
        <ErrorOverlay />
        <ProgressBar />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  fetch: PropTypes.func,
  loadList: PropTypes.func
};

export default connect(null, { fetch, loadList })(App);
