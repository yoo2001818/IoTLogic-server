import React, { Component } from 'react';

import { Link } from 'react-router';

import AppContainer from '../../container/appContainer';
import Section from '../../component/ui/section';

import __ from '../../lang';

export default class NewDevice extends Component {
  render() {
    return (
      <AppContainer title={__('NewDeviceTitle')}>
        <div className='new-device-view general-view'>
          <div className='content'>
            <Section title={__('NewDeviceSelectTypeTitle')}>
              <p className='tip'>{__('NewDeviceSelectTypeDesc')}</p>
              {/* Hard-coded device types... Hmm. */}
              <ul className='menu-list'>
                <li>
                  <Link to='/new/device/pc'>{__('DeviceTypePc')}</Link>
                </li>
                <li>
                  <Link to='/new/device/android'>
                    {__('DeviceTypeAndroid')}
                  </Link>
                </li>
                <li>
                  <Link to='/new/device/pulser'>
                    Pulser (test)
                  </Link>
                </li>
              </ul>
            </Section>
          </div>
        </div>
      </AppContainer>
    );
  }
}
