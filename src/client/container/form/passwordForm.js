import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import classNames from 'classnames';
import { changePassword } from '../../action/user';

import { Password } from '../../../validation/schema';
import validate from '../../../validation/validate';

import Field from '../../component/ui/field';
import Button from '../../component/ui/button';
import ErrorInput from '../../component/ui/errorInput';

import __ from '../../lang';

class PasswordForm extends Component {
  handleSubmit(values) {
    return this.props.changePassword(values, {errors: [400, 401]})
    .then(action => {
      if (!action.error) {
        this.props.resetForm();
        return;
      }
      if (action.payload.body.id === 'INVALID_PASSWORD') {
        throw {
          password: {
            name: 'ErrorPasswordInvalid'
          }
        };
      }
      throw {
        [action.payload.body.field]: {
          name: action.payload.body.type
        }
      };
    });
  }
  render() {
    const { fields: { password, newPassword },
      handleSubmit, invalid, className, submitting } = this.props;
    const onSubmit = handleSubmit(this.handleSubmit.bind(this));
    return (
      <div className={classNames('password-form', className)}>
        <form onSubmit={onSubmit}>
          <Field label={__('CurrentPassword')}>
            <ErrorInput type='password' placeholder={__('CurrentPassword')}
              {...password}
            />
          </Field>
          <Field label={__('NewPassword')}>
            <ErrorInput type='password' placeholder={__('NewPassword')}
              {...newPassword}
            />
          </Field>
          <div className='section-action'>
            <Button onClick={onSubmit} disabled={invalid ||
              submitting}
            >
              <span className='check-icon icon-right'  />
              {__('ChangePasswordBtn')}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

PasswordForm.propTypes = {
  handleSubmit: PropTypes.func,
  fields: PropTypes.object,
  invalid: PropTypes.bool,
  className: PropTypes.string,
  submitting: PropTypes.bool,
  changePassword: PropTypes.func,
  resetForm: PropTypes.func
};

export default reduxForm({
  form: 'password',
  fields: ['password', 'newPassword'],
  validate: (values) => {
    let validations = validate(values, {newPassword: Password}, true);
    return validations;
  }
}, null, { changePassword })(PasswordForm);
