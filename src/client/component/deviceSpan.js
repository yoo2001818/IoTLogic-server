import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

export default class DeviceSpan extends Component {
  render() {
    const { name, alias, connected } = this.props.device;
    return (
      <Link className='device-span'
        activeClassName='active'
        to={`/devices/${name}`}
      >
        <span className='alias'>{alias || name}</span>
        {alias && <span className='name'>{name}</span>}
        <span className={classNames('connection-marker', { connected })} />
      </Link>
    );
  }
}

DeviceSpan.propTypes = {
  device: PropTypes.object
};
