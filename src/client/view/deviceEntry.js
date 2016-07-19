import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { load, confirmDeviceDelete } from '../action/device';

import DeviceEntryForm from '../container/form/deviceEntryForm';
import AppContainer from '../container/appContainer';
import NotFound from './notFound';
import Loading from './loading';

class DeviceEntry extends Component {
  render() {
    const { device } = this.props;
    if (device && device.documents !== undefined && !device.deleted) {
      return (
        <AppContainer title={device.alias || device.name}>
          <div className='device-entry-view general-view'>
            <DeviceEntryForm className='content noborder-input'
              initialValues={device} formKey={'id/'+device.id}
              device={device}
            />
          </div>
        </AppContainer>
      );
    } else if (device === null || (device && device.deleted)) {
      return <NotFound />;
    } else {
      return <Loading />;
    }
  }
}

DeviceEntry.propTypes = {
  device: PropTypes.object,
  confirmDeviceDelete: PropTypes.func
};

const ConnectDeviceEntry = connect(
  (store, props) => ({
    device: store.entities.devices[props.params.name]
  }), { confirmDeviceDelete }
)(DeviceEntry);

ConnectDeviceEntry.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(load(params.name));
};

export default ConnectDeviceEntry;
