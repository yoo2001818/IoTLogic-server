import React, { Component } from 'react';

import { Link } from 'react-router';

import AppContainer from '../../container/appContainer';
import Section from '../../component/ui/section';

import __ from '../../lang';

export default class NewDevicePC extends Component {
  render() {
    return (
      <AppContainer title={__('NewDeviceTitle')}>
        <div className='new-device-view general-view'>
          <div className='content'>
            <Section title={__('DeviceTypePc')}>
              주저리주저리 주저리주저리 주저리주저리
            </Section>
          </div>
        </div>
      </AppContainer>
    );
  }
}
