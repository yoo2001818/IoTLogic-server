import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { loadList } from '../action/device';

import { IndexLink } from 'react-router';
import Entry from '../component/sidebar/entry';

import __ from '../lang';

class SideNavigation extends Component {
  render() {
    console.log(this.props);
    return (
      <Entry hideHeader>
        <ul className='side-navigation'>
          <li>
            <IndexLink activeClassName='active' to='/'>
              {__('IndexTitle')}
            </IndexLink>
          </li>
          <li><a>{__('DevicesTitle')}</a></li>
          <li><a>{__('DocumentsTitle')}</a></li>
        </ul>
      </Entry>
    );
  }
  componentDidMount() {
    this.props.loadList();
  }
}

SideNavigation.propTypes = {
  deviceList: PropTypes.array,
  loadList: PropTypes.func
};

export default connect(state => ({
  deviceList: (state.device.list || []).map(v => state.entities.devices[v])
}), { loadList })(SideNavigation);
