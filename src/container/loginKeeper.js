import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';

import { login } from '../action/user';

import LoginForm from './form/loginForm';

import FullOverlay from '../component/ui/fullOverlay';
import Dialog from '../component/ui/dialog';

import __ from '../lang';

class LoginKeeper extends Component {
  render() {
    const {
      loginRequired = (
        <FullOverlay>
          <Dialog title={__('LoginTitle')}>
            <p>{__('LoginRequiredDesc')}</p>
            <LoginForm onLogin={this.props.login} className='dialog' />
          </Dialog>
        </FullOverlay>
      ),
      children, username
    } = this.props;
    /*if (transport.status === 'pending' ||
      (transport.status === 'connected' && connectionId == null)) {
      return pending;
    }
    if (transport.status === 'disconnected') {
      return cloneElement(disconnected, {
        error: transport.error,
        onReconnect: reconnect
      });
    }
    if (transport.status === 'failed') {
      return cloneElement(failed, {
        error: transport.error,
        onReconnect: reconnect
      });
    }*/
    return loginRequired;
  }
}

LoginKeeper.propTypes = {
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
