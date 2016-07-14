import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import classNames from 'classnames';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';

import { User, Password } from '../../validation/schema';
import validate from '../../validation/validate';

import Button from '../../component/ui/button';
import ErrorInput from '../../component/ui/errorInput';

import __ from '../../lang';

class RegisterForm extends Component {
  handleSubmit(values) {
    return this.props.onRegister(values, {errors: [400, 409]})
    .then(action => {
      if (!action.error) {
        browserHistory.push('/');
        return;
      }
      throw {
        [action.payload.body.field]: {
          name: action.payload.body.type
        }
      };
    });
  }
  render() {
    const { fields: { username, password, name, email },
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
            <ErrorInput type='text' placeholder={__('Name')}
              {...name}
            />
            <ErrorInput type='email' placeholder={__('Email')}
              {...email}
            />
          </div>
          <div className='action'>
            <Button onClick={onSubmit} button disabled={invalid}>
              {__('RegisterBtn')}
            </Button>
            <div className='register'>
              <Link to='/'>{__('Back')}</Link>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func,
  fields: PropTypes.object,
  invalid: PropTypes.bool,
  onRegister: PropTypes.func,
  className: PropTypes.string
};

export default reduxForm({
  form: 'registerLogin',
  fields: ['username', 'password', 'name', 'email'],
  validate: (values) => {
    let validations = validate(values, User, true);
    validations = Object.assign(validations,
      validate(values, { password: Password }, true));
    return validations;
  }
})(RegisterForm);
