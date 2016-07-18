import React, { Component, PropTypes } from 'react';

import DeviceMenu from './deviceMenu';

import { IndexLink } from 'react-router';
import SidebarHeader from '../component/header/sidebar';

import __ from '../lang';

export default class SideMenu extends Component {
  render() {
    return (
      <div>
        <SidebarHeader left={__('SidebarTitle')} />
        <div className='content'>
          <div className='sidebar-entry'>
            <ul className='side-navigation'>
              <li>
                <IndexLink activeClassName='active' to='/'>
                  {__('IndexTitle')}
                </IndexLink>
              </li>
              <DeviceMenu />
              <li>
                <div className='subcategory-name'>{__('DocumentsTitle')}</div>
                <ul className='subcategory'>
                  <li><a>고급 문서</a></li>
                  <li><a>중급 문서</a></li>
                  <li><a>저급 문서</a></li>
                </ul>
              </li>
            </ul>
          </div>
          { this.props.children }
        </div>
      </div>
    );
  }
}

SideMenu.propTypes = {
  children: PropTypes.node
};
