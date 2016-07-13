import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetch } from '../action/user';

import AppContainer from '../container/appContainer';
import __ from '../lang';

import ProgressBar from '../container/progressBar';
import ErrorOverlay from '../container/errorOverlay';

class App extends Component {
  componentWillMount() {
    this.props.fetch();
  }
  render() {
    // Just a mockup..
    return (
      <div id='app'>
        <div className='app-wrapper'>
          <AppContainer
            title={__('IoTLogicTitle')}
          >
            {this.props.children}
          </AppContainer>
        </div>
        <ErrorOverlay />
        <ProgressBar />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  fetch: PropTypes.func
};

export default connect(null, { fetch })(App);
