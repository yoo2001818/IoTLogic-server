import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { loadList } from '../action/device';
import DeviceSpan from '../component/deviceSpan';

import { IndexLink } from 'react-router';
import Entry from '../component/sidebar/entry';

import __ from '../lang';

class SideMenu extends Component {
  render() {
    return (
      <Entry hideHeader>
        <ul className='side-navigation'>
          <li>
            <IndexLink activeClassName='active' to='/'>
              {__('IndexTitle')}
            </IndexLink>
          </li>
          <li>
            <div className='subcategory-name'>
              {__('DevicesTitle')}
              {this.props.deviceLoading && <span className='load-icon' />}
            </div>
            <ul className='subcategory'>
              {
                this.props.deviceList.map(device => (
                  <li key={device.id}><DeviceSpan device={device} /></li>
                ))
              }
            </ul>
          </li>
          <li>
            <div className='subcategory-name'>{__('DocumentsTitle')}</div>
            <ul className='subcategory'>
              <li><a>고급 문서</a></li>
              <li><a>중급 문서</a></li>
              <li><a>저급 문서</a></li>
            </ul>
          </li>
        </ul>
      </Entry>
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

SideMenu.propTypes = {
  user: PropTypes.object,
  deviceLoading: PropTypes.bool,
  deviceList: PropTypes.array,
  loadList: PropTypes.func
};

export default connect(state => ({
  user: state.entities.users[state.user.username],
  deviceLoading: state.device.load && state.device.load.loading,
  deviceList: (state.device.list || []).map(v => state.entities.devices[v])
}), { loadList })(SideMenu);
