import React, { Component } from 'react';

import { IndexLink } from 'react-router';
import Entry from '../component/sidebar/entry';

import __ from '../lang';

class SideNavigation extends Component {
  render() {
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
}

SideNavigation.propTypes = {
};

export default SideNavigation;
