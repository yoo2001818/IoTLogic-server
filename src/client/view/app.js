import React, { Component, PropTypes } from 'react';

import { load } from '../action/user';
import { loadList as deviceLoadList } from '../action/device';
import { loadList as documentLoadList } from '../action/document';

import LoginKeeper from '../container/loginKeeper';
import InitKeeper from '../container/initKeeper';
import ProgressBar from '../container/progressBar';
import ErrorOverlay from '../container/errorOverlay';
import ModalOverlay from '../container/modalOverlay';

export default class App extends Component {
  render() {
    // Just a mockup..
    return (
      <div id='app'>
        <div className='app-wrapper'>
          <InitKeeper>
            {this.props.children.type.noLogin ? this.props.children : (
              <LoginKeeper>
                {this.props.children}
              </LoginKeeper>
            )}
          </InitKeeper>
        </div>
        <ErrorOverlay />
        <ModalOverlay />
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
    store.dispatch(deviceLoadList()),
    store.dispatch(documentLoadList())
  ]);
};
