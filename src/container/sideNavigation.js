import React, { Component } from 'react';

import { IndexLink } from 'react-router';
import Entry from '../component/sidebar/entry';

import __ from '../lang';

class SideNavigation extends Component {
  render() {
    return (
      <Entry hideHeader noPadding>
        <ul className='side-navigation'>
          <li>
            <IndexLink activeClassName='active' to='/'>
              {__('RoomListTitle')}
            </IndexLink>
          </li>
          <li><a>{__('ProfileTitle')}</a></li>
        </ul>
      </Entry>
    );
  }
}

SideNavigation.propTypes = {
};

export default SideNavigation;
