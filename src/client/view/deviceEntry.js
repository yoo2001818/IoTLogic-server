import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { load } from '../action/device';

import AppContainer from '../container/appContainer';
import Section from '../component/ui/section';
import Field from '../component/ui/field';
import Button from '../component/ui/button';
import ErrorInput from '../component/ui/errorInput';
import NotFound from './notFound';
import Loading from './loading';
import __ from '../lang';

function capitalize(str) {
  if (str == null || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class DeviceEntry extends Component {
  render() {
    const { device } = this.props;
    if (device && device.documents !== undefined) {
      return (
        <AppContainer title={device.alias || device.name}>
          <div className='device-entry-view general-view'>
            <div className='content noborder-input'>
              <Section title={__('DeviceInfoSection')}>
                <Field label={__('DeviceNameLabel')}>
                  <ErrorInput value={device.name} />
                </Field>
                <Field label={__('DeviceAliasLabel')}>
                  <ErrorInput value={device.alias || ''} />
                </Field>
                <Field label={__('DeviceTypeLabel')}>
                  <div className='readonly'>
                    {__('DeviceType' + capitalize(device.type))}
                  </div>
                </Field>
                <div className='section-action'>
                  <Button>Save</Button>
                </div>
              </Section>
              <Section title={__('DeviceStatusSection')}>
                <Field label={__('DeviceConnectedLabel')}>
                  <div className='readonly'>
                    {device.connected ? __('DeviceConnected') :
                      __('DeviceDisconnected')}
                  </div>
                </Field>
              </Section>
              <Section title={__('DeviceDocumentSection')}>
                Work in progress
              </Section>
              <Section title={__('DevicePlatformSection')}>
                Work in progress
              </Section>
              <pre>
                {JSON.stringify(device, null, 2)}
              </pre>
            </div>
          </div>
        </AppContainer>
      );
    } else if (device === null) {
      return <NotFound />;
    } else {
      return <Loading />;
    }
  }
}

DeviceEntry.propTypes = {
  device: PropTypes.object
};

const ConnectDeviceEntry = connect(
  (store, props) => ({
    device: store.entities.devices[props.params.name]
  })
)(DeviceEntry);

ConnectDeviceEntry.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(load(params.name));
};

export default ConnectDeviceEntry;
