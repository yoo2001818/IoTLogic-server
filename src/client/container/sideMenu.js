import React, { Component, PropTypes } from 'react';

import DeviceMenu from './deviceMenu';
import DocumentMenu from './documentMenu';

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
              <DocumentMenu />
              <li>
                <a href='/doc' target='_blank'>
                  {__('ManualTitle')}
                </a>
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
