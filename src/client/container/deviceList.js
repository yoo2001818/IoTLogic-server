import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import DeviceSpan from '../component/deviceSpan';

import __ from '../lang';

class DeviceList extends Component {
  filterRemoved() {
    return this.props.value.filter((_, i) => this.props.list[i] != null);
  }
  handleRemove(index) {
    this.props.onChange(this.filterRemoved(this.props.value)
      .filter((_, i) => i !== index));
  }
  handleAdd(value) {
    this.props.onChange(this.filterRemoved(this.props.value)
      .concat(value));
  }
  render() {
    return (
      <div className='device-list-root'>
        <ul className='device-list'>
          {
            this.props.list.some(v => v != null) ? (
              this.props.list.map((device, index) => {
                if (device == null) return false;
                return (
                  <li key={device.id}>
                    <DeviceSpan device={device} />
                    <div className='remove-btn' tabIndex={0}
                      onClick={this.handleRemove.bind(this, index)}
                    >
                      <span className='minus-icon' />
                    </div>
                  </li>
                );
              })) : (
              <p className='tip'>{__('DocumentDeviceListEmptyTip')}</p>
            )
          }
        </ul>
        <ul className='device-list unadded'>
          {
            this.props.unAddedList.length > 0 ? (
              this.props.unAddedList.map((device) => (
                <li key={device.id}>
                  <DeviceSpan device={device} />
                  <div className='add-btn' tabIndex={0}
                    onClick={this.handleAdd.bind(this, device.name)}
                  >
                    <span className='plus-icon' />
                  </div>
                </li>
            ))) : (
              this.props.deviceListEmpty ? (
                <p className='tip'>
                  {__('DocumentDeviceListBottomRealEmptyTip')}
                </p>
              ) : (
                <p className='tip'>
                  {__('DocumentDeviceListBottomEmptyTip')}
                </p>
              )
            )
          }
        </ul>
      </div>
    );
  }
}

DeviceList.propTypes = {
  list: PropTypes.array,
  unAddedList: PropTypes.array,
  deviceListEmpty: PropTypes.bool,
  value: PropTypes.array,
  onChange: PropTypes.func
};

export default connect((state, props) => ({
  list: (props.value || []).map(v => state.entities.devices[v]),
  unAddedList: (state.device.list || [])
    .filter(v => props.value.indexOf(v) === -1)
    .map(v => state.entities.devices[v]),
  deviceListEmpty: (state.device.list || []).length === 0
}))(DeviceList);
