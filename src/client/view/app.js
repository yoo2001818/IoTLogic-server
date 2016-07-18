import React, { Component, PropTypes } from 'react';

import { load } from '../action/user';
import { loadList } from '../action/device';

import InitKeeper from '../container/initKeeper';
import ProgressBar from '../container/progressBar';
import ErrorOverlay from '../container/errorOverlay';

export default class App extends Component {
  render() {
    // Just a mockup..
    return (
      <div id='app'>
        <div className='app-wrapper'>
          <InitKeeper>
            {this.props.children}
          </InitKeeper>
        </div>
        <ErrorOverlay />
        <ProgressBar />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};

App.fetchData = function(store) {
  return Promise.all([
    store.dispatch(load()),
    store.dispatch(loadList())
  ]);
};
