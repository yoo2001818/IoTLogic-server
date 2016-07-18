import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { load } from '../action/device';

import AppContainer from '../container/appContainer';
import NotFound from './notFound';
import Loading from './loading';
import __ from '../lang';

class DeviceEntry extends Component {
  render() {
    const { device } = this.props;
    if (device && device.documents !== undefined) {
      return (
        <AppContainer title={device.alias || device.name}>
          <div>
            Device entry
            <pre>
              {JSON.stringify(device, null, 2)}
            </pre>
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
