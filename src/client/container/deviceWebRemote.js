import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { triggerRemote } from '../action/device';

import Button from '../component/ui/button';

class DeviceWebRemote extends Component {
  handleTrigger(group, name) {
    this.props.triggerRemote(this.props.device.name, group, name);
  }
  renderComponent(component, group, name) {
    if (component.type === 'button') {
      return (
        <Button div tabIndex={0} key={name}
          onClick={this.handleTrigger.bind(this, group, name)}
        >
          {component.text}
        </Button>
      );
    }
    return (
      <div className='component-text' key={name}>
        {component.text}
      </div>
    );
  }
  renderGroup(group, name) {
    return (
      <div className='group' key={name}>
        {Object.keys(group).map(key => (
          this.renderComponent(group[key] || {}, name, key)
        ))}
      </div>
    );
  }
  render() {
    const { device } = this.props;
    let groups = device.remote || {};
    return (
      <div className='device-web-remote'>
        {Object.keys(groups).map(key => (
          this.renderGroup(groups[key], key)
        ))}
      </div>
    );
  }
}

DeviceWebRemote.propTypes = {
  device: PropTypes.object,
  triggerRemote: PropTypes.func
};

export default connect(undefined, { triggerRemote })(DeviceWebRemote);
