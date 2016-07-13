import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';

import { login } from '../action/user';

import LoginForm from './form/loginForm';

import FullOverlay from '../component/ui/fullOverlay';
import Dialog from '../component/ui/dialog';
import Footer from '../component/footer';

import __ from '../lang';

class LoginKeeper extends Component {
  render() {
    const { introduction } = this.props;
    const {
      loginRequired = (
        <FullOverlay>
          {introduction ? (
            <Dialog title={__('WelcomeLoginTitle')}>
              <p className='small-desc'>{__('WelcomeLoginDesc')}</p>
              <LoginForm onLogin={this.props.login} className='dialog' />
            </Dialog>
          ) : (
            <Dialog title={__('LoginTitle')}>
              <p className='small-desc'>{__('LoginRequiredDesc')}</p>
              <LoginForm onLogin={this.props.login} className='dialog' />
            </Dialog>
          )}
          <Footer fixed />
        </FullOverlay>
      ),
      children, username
    } = this.props;
    if (username == null) {
      return loginRequired;
    }
    return children;
  }
}

LoginKeeper.propTypes = {
  introduction: PropTypes.bool,
  loginRequired: PropTypes.node,
  children: PropTypes.node,
  username: PropTypes.any,
  login: PropTypes.func.isRequired
};

export default connect(
  state => ({
    username: state.user.username,
  }),
  { login }
)(LoginKeeper);
