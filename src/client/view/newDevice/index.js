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
                  <a href='/doc#clientInstallHelp'
                    target='_blank'
                  >{__('DeviceTypePc')}</a>
                </li>
                <li>
                  <Link to='/new/device/webRemote'>
                    {__('DeviceTypeWebRemote')}
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
