import React, { Component } from 'react';
import AppContainer from '../container/appContainer';
import __ from '../lang';

export default class Loading extends Component {
  render() {
    return (
      <AppContainer title={__('LoadingTitle')}>
        <div className='loading-view'>
          <div className='header'>
            <span className='load-icon' />
          </div>
        </div>
      </AppContainer>
    );
  }
}
