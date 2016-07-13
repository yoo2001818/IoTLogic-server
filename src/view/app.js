import React, { Component, PropTypes } from 'react';

import AppContainer from '../container/appContainer';
import LoginKeeper from '../container/loginKeeper';
import __ from '../lang';

import ProgressBar from '../container/progressBar';
// import ErrorOverlay from '../container/errorOverlay';

export default class App extends Component {
  render() {
    // Just a mockup..
    return (
      <div id='app'>
        <LoginKeeper>
          <div className='app-wrapper'>
            <AppContainer
              title={__('IoTLogicTitle')}
            >
              {this.props.children}
            </AppContainer>
          </div>
        </LoginKeeper>
        <ProgressBar />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};
