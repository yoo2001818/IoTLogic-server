import React, { Component } from 'react';
import LoginKeeper from '../container/loginKeeper';
import AppContainer from '../container/appContainer';
import __ from '../lang';

export default class Index extends Component {
  render() {
    return (
      <LoginKeeper introduction>
        <AppContainer title={__('IndexTitle')}>
          <div className='index-view'>
            <div className='content'>
              {__('IndexDescription')}
            </div>
          </div>
        </AppContainer>
      </LoginKeeper>
    );
  }
}

Index.noLogin = true;
