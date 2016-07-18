import React, { Component } from 'react';
import AppContainer from '../container/appContainer';
import __ from '../lang';

export default class NotFound extends Component {
  render() {
    return (
      <AppContainer title={__('NotFoundTitle')}>
        <div className='not-found-view'>
          <div className='header'>
            <span className='icon' />
          </div>
          <div className='content'>
            {__('NotFoundDesc')}
          </div>
        </div>
      </AppContainer>
    );
  }
}
