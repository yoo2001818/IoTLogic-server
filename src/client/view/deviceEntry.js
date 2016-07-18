import React, { Component } from 'react';
import AppContainer from '../container/appContainer';
import __ from '../lang';

export default class DeviceEntry extends Component {
  render() {
    return (
      <AppContainer title={__('NotFoundTitle')}>
        <div>
          Device entry
        </div>
      </AppContainer>
    );
  }
}
