import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import classNames from 'classnames';

import Button from '../../component/ui/button';
import ErrorInput from '../../component/ui/errorInput';

import __ from '../../lang';

class LoginForm extends Component {
  handleSubmit(values) {
    return this.props.onLogin(values)
    .then(action => {
      if (!action.error) return;
      if (action.payload.body.id === 'INVALID_USERNAME') {
        throw {
          username: {
            name: 'ErrorUsernameInvalid'
          }
        };
      }
      if (action.payload.body.id === 'INVALID_PASSWORD') {
        throw {
          password: {
            name: 'ErrorPasswordInvalid'
          }
        };
      }
    });
  }
  render() {
    const { fields: { username, password },
      handleSubmit, invalid, className } = this.props;
    const onSubmit = handleSubmit(this.handleSubmit.bind(this));
    return (
      <form onSubmit={onSubmit}>
        <div className={classNames('login-form', className)}>
          <div className='content'>
            <ErrorInput type='text' placeholder={__('Username')}
              {...username}
            />
            <ErrorInput type='password' placeholder={__('Password')}
              {...password}
            />
          </div>
          <div className='action'>
            <Button onClick={onSubmit} button disabled={invalid}>
              {__('LoginBtn')}
            </Button>
            <div className='register'>
              <Link to='/register'>{__('RegisterBtn')}</Link>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  fields: PropTypes.object,
  invalid: PropTypes.bool,
  onLogin: PropTypes.func,
  className: PropTypes.string
};

export default reduxForm({
  form: 'login',
  fields: ['username', 'password'],
  validate: (values) => {
    let validations = {};
    if (!values.username) {
      validations.username = {
        name: 'ErrorValidationRequired'
      };
    }
    if (!values.password) {
      validations.password = {
        name: 'ErrorValidationRequired'
      };
    }
    return validations;
  }
})(LoginForm);