import React, { Component, PropTypes } from 'react';

import ProgressBar from '../container/progressBar';
// import ErrorOverlay from '../container/errorOverlay';

export default class App extends Component {
  render() {
    // Just a mockup..
    return (
      <div id='app'>
        <div className='app-wrapper'>
          {this.props.children}
        </div>
        <ProgressBar />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};
