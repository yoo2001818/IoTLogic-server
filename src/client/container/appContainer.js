import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { open, close, toggle } from '../action/sidebar';

import Header from '../component/header';
import SidebarHeader from '../component/header/sidebar';
import Sidebar from '../component/sidebar';

import LoginMenu from './loginMenu';
import SideMenu from './sideMenu';

class AppContainer extends Component {
  render() {
    const { title, headerRight, showLogin = true, sidebar, children,
      isOpen, close, toggle } = this.props;
    return (
      <div className='app-container'>
        <div className='headers'>
          <Header
            onSidebar={toggle.bind(null, null)}
            showSidebar={isOpen}
            title={title}
            right={(
              <div>
                {headerRight}
                {showLogin && (<LoginMenu />)}
              </div>
            )}
          />
        </div>
        <div className='wrapper'>
          <Sidebar
            visible={isOpen}
            onClose={close.bind(null, null)}
          >
            <SidebarHeader left='메뉴' />
            <div className='content'>
              <SideMenu />
              { sidebar }
            </div>
          </Sidebar>
          <div className='content'>
            { children }
          </div>
        </div>
      </div>
    );
  }
}

AppContainer.propTypes = {
  title: PropTypes.node,
  headerRight: PropTypes.node,
  showLogin: PropTypes.bool,
  sidebar: PropTypes.node,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  open: PropTypes.func,
  close: PropTypes.func,
  toggle: PropTypes.func
};

export default connect(state => ({
  isOpen: state.sidebar.open
}), { open, close, toggle })(AppContainer);
