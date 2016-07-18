import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { loadList } from '../action/device';
import DeviceSpan from '../component/deviceSpan';

import __ from '../lang';

class DeviceMenu extends Component {
  render() {
    return (
      <li>
        <div className='subcategory-name'>
          {__('DevicesTitle')}
          {this.props.loading && <span className='load-icon' />}
          <Link className='add-icon' activeClassName='active'
            to='/new/device'
          />
        </div>
        <ul className='subcategory'>
          {
            this.props.list.map(device => (
              <li key={device.id}><DeviceSpan device={device} /></li>
            ))
          }
        </ul>
      </li>
    );
  }
  componentWillUpdate(nextProps) {
    if (this.props.user == null && nextProps.user) {
      this.props.loadList();
    }
  }
  componentDidMount() {
    if (this.props.user != null) {
      this.props.loadList();
    }
  }
}

DeviceMenu.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool,
  list: PropTypes.array,
  loadList: PropTypes.func
};

export default connect(state => ({
  user: state.entities.users[state.user.username],
  loading: state.device.load && state.device.load.loading,
  list: (state.device.list || []).map(v => state.entities.devices[v])
}), { loadList })(DeviceMenu);
