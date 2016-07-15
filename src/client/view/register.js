import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { register, logout } from '../action/user';

import RegisterForm from '../container/form/registerForm';

import FullOverlay from '../component/ui/fullOverlay';
import Button from '../component/ui/button';
import Dialog, { Controls } from '../component/ui/dialog';
import Footer from '../component/footer';

import __ from '../lang';

class Register extends Component {
  render() {
    const { username, logout, register } = this.props;
    return (
      <FullOverlay>
        <Dialog title={__('RegisterTitle')}>
          { username == null ? (
            <RegisterForm onRegister={register} className='dialog' />
          ) : (
            <div>
              <p>{__('AlreadyLoggedDesc')}</p>
              <Controls>
                <Button onClick={logout}>{__('Logout')}</Button>
              </Controls>
            </div>
          )}
        </Dialog>
        <Footer fixed />
      </FullOverlay>
    );
  }
}

Register.propTypes = {
  username: PropTypes.string,
  register: PropTypes.func,
  logout: PropTypes.func
};

export default connect(
  state => ({
    username: state.user.username,
  }),
  { register, logout }
)(Register);
