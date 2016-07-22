import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

export default class DeviceSpan extends Component {
  render() {
    const { children } = this.props;
    const { name, alias, connected, errors } = this.props.device;
    return (
      <Link className='device-span'
        activeClassName='active'
        to={`/devices/${name}`}
      >
        <span className='alias'>{alias || name}</span>
        {alias && <span className='name'>{name}</span>}
        <span className={classNames('connection-marker', { connected })} />
        <span className={classNames('error-marker', { error:
          connected && errors && errors.length > 0 })} />
        { children }
      </Link>
    );
  }
}

DeviceSpan.propTypes = {
  device: PropTypes.object,
  children: PropTypes.node
};
