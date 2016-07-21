import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import classNames from 'classnames';
import { setProfile } from '../../action/user';

import { User } from '../../../validation/schema';
import validate from '../../../validation/validate';

import Field from '../../component/ui/field';
import Button from '../../component/ui/button';
import ErrorInput from '../../component/ui/errorInput';

import __ from '../../lang';

class ProfileForm extends Component {
  handleSubmit(values) {
    return this.props.setProfile(values, {errors: [400, 409]})
    .then(action => {
      if (!action.error) return;
      throw {
        [action.payload.body.field]: {
          name: action.payload.body.type
        }
      };
    });
  }
  render() {
    const { fields: { username, name, email },
      handleSubmit, invalid, className, submitting, dirty } = this.props;
    const onSubmit = handleSubmit(this.handleSubmit.bind(this));
    return (
      <div className={classNames('profile-form', className)}>
        <form onSubmit={onSubmit}>
          <Field label={__('Username')}>
            <div className='readonly'>
              {username.value}
            </div>
          </Field>
          <Field label={__('Name')}>
            <ErrorInput type='text' placeholder={__('Name')}
              {...name}
            />
          </Field>
          <Field label={__('Email')}>
            <ErrorInput type='email' placeholder={__('Email')}
              {...email}
            />
          </Field>
          <div className='section-action'>
            <Button onClick={onSubmit} disabled={!dirty || invalid ||
              submitting}
            >
              <span className='check-icon icon-right'  />
              {__('Save')}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

ProfileForm.propTypes = {
  handleSubmit: PropTypes.func,
  fields: PropTypes.object,
  invalid: PropTypes.bool,
  className: PropTypes.string,
  submitting: PropTypes.bool,
  dirty: PropTypes.bool,
  setProfile: PropTypes.func
};

export default reduxForm({
  form: 'profile',
  fields: ['username', 'name', 'email'],
  validate: (values) => {
    let validations = validate(values, User, true);
    return validations;
  }
}, null, { setProfile })(ProfileForm);
