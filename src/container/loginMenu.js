import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { logout } from '../action/user';

import __ from '../lang';

import DropDown from '../component/ui/dropDown';

class LoginMenu extends Component {
  handleLogout(e) {
    const { logout } = this.props;
    logout();
    e.preventDefault();
  }
  render() {
    const { user } = this.props;
    if (user == null) { // ...
      // Show login link
      return (
        <div className='login-menu anonymous'>
          <div className='action'>
            <Link to='/'>{__('Login')}</Link>
          </div>
        </div>
      );
    }
    return (
      <div className='login-menu guest'>
        <div className='user-info'>
          <DropDown href='#' title={(
            user.name || user.username
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
  user: PropTypes.object,
  logout: PropTypes.func
};

export default connect(state => ({
  user: state.entities.users[state.user.username]
}), { logout })(LoginMenu);
