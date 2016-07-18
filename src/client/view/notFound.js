import React, { Component } from 'react';
import AppContainer from '../container/appContainer';
import __ from '../lang';

export default class NotFound extends Component {
  render() {
    return (
      <AppContainer title={__('NotFoundTitle')}>
        <div>
          404 Page not found
        </div>
      </AppContainer>
    );
  }
}
