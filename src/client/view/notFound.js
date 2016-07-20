import React, { Component } from 'react';
import AppContainer from '../container/appContainer';
import __ from '../lang';

export default class NotFound extends Component {
  render() {
    return (
      <AppContainer title={__('NotFoundTitle')}>
        <div className='not-found-view general-view'>
          <div className='content'>
            <div className='header'>
              <span className='icon' />
            </div>
            <div className='message'>
              {__('NotFoundDesc')}
            </div>
          </div>
        </div>
      </AppContainer>
    );
  }
}
