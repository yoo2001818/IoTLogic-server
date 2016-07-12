import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import __ from '../lang';

import DropDown from '../component/ui/dropDown';

export default class LoginMenu extends Component {
  handleLogout(e) {
    const { logout } = this.props;
    logout();
    e.preventDefault();
  }
  render() {
    if (true) { // ...
      // Show login link
      return (
        <div className='login-menu anonymous'>
          <div className='action'>
            <Link to='/login'>{__('Login')}</Link>
          </div>
        </div>
      );
    }
    return (
      <div className='login-menu guest'>
        <div className='user-info'>
          <DropDown href='#' title={(
            "Derp"
          )}>
            <ul className='menu-list'>
              <li>
                <Link to='/login' onClick={this.handleLogout.bind(this)}>
                  {__('Logout')}
                </Link>
              </li>
            </ul>
          </DropDown>
        </div>
      </div>
    );
  }
}

LoginMenu.propTypes = {
  connection: PropTypes.object,
  logout: PropTypes.func
};
