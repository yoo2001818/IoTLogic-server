import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import __ from '../../lang';

import TextInput from './textInput';
import Alert from './alert';

class ErrorAlert extends Component {
  render() {
    const { error } = this.props;
    if (error === true) return false;
    if (error && error.name === 'ErrorValidationRequired') return false;
    return (
      <Alert>
        {typeof error === 'string' ? ( error ) : (
          __(error.name, error.value)
        )}
      </Alert>
    );
  }
}

ErrorAlert.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any
    })
  ])
};

const InputProps = [
  // HTML attributes
  'placeholder',
  'type',
  'value',
  // Event listeners
  'onBlur',
  'onChange',
  'onFocus'
];

function filterProps(props) {
  let obj = {};
  InputProps.forEach(v => obj[v] = props[v]);
  return obj;
}

export default class ErrorInput extends Component {
  render() {
    const { error, touched, showValid, valid, asyncValidating, label }
      = this.props;
    return (
      <div className='error-input-component'>
        <label>
          <span className='label'>
            {label}
          </span>
          <span className={classNames('field', {
            error: error && touched,
            valid: showValid && valid && touched && !asyncValidating,
            asyncValidating
          })}>
            <TextInput {...filterProps(this.props)} />
            <div className='indicator' />
          </span>
        </label>
        { error && (
          <ErrorAlert error={error} />
        )}
      </div>
    );
  }
}

ErrorInput.propTypes = {
  label: PropTypes.node,
  error: PropTypes.any,
  touched: PropTypes.bool,
  valid: PropTypes.bool,
  showValid: PropTypes.bool,
  asyncValidating: PropTypes.bool
};
