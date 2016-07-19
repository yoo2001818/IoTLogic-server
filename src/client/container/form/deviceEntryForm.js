import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import classNames from 'classnames';

import { confirmDeviceDelete, update as deviceUpdate }
  from '../../action/device';
import { replace } from 'react-router-redux';

import { Device } from '../../../validation/schema';
import validate from '../../../validation/validate';

import Section from '../../component/ui/section';
import Field from '../../component/ui/field';
import Button from '../../component/ui/button';
import ErrorInput from '../../component/ui/errorInput';

import __ from '../../lang';

function capitalize(str) {
  if (str == null || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class DeviceEntryForm extends Component {
  handleDelete(e) {
    e.preventDefault();
    this.props.confirmDeviceDelete(this.props.device);
  }
  handleSubmit(values) {
    let changed = values.name !== undefined &&
      this.props.device.name !== values.name;
    return this.props.deviceUpdate(this.props.device.name, values)
    .then(v => {
      if (changed) this.props.replace('/devices/' + v.payload.result);
    });
  }
  render() {
    const { fields: { name, alias, type },
      handleSubmit, invalid, submitting, device, className } = this.props;
    const onSubmit = handleSubmit(this.handleSubmit.bind(this));
    if (device == null) return false;
    return (
        <div className={classNames('device-entry-form', className)}>
          <form onSubmit={onSubmit}>
            <Section title={__('DeviceInfoSection')}>
              <Field label={__('DeviceNameLabel')}>
                <ErrorInput type='text' placeholder={__('DeviceNameLabel')}
                  {...name}
                />
              </Field>
              <Field label={__('DeviceAliasLabel')}>
                <ErrorInput type='text' placeholder={__('DeviceAliasLabel')}
                  {...alias}
                />
              </Field>
              <Field label={__('DeviceTypeLabel')}>
                <div className='readonly'>
                  {__('DeviceType' + capitalize(type.value))}
                </div>
              </Field>
              <div className='section-action'>
                <Button className='red' div
                  onClick={this.handleDelete.bind(this)}
                >
                  <span className='trash-icon icon-right' />
                  {__('DeviceDelete')}
                </Button>
                <Button onClick={onSubmit} disabled={invalid || submitting}>
                  <span className='check-icon icon-right'  />
                  {__('Save')}
                </Button>
              </div>
            </Section>
            <Section title={__('DeviceStatusSection')}>
              <Field label={__('DeviceConnectedLabel')}>
                <div className='readonly'>
                  {device.connected ? __('DeviceConnected') :
                    __('DeviceDisconnected')}
                </div>
              </Field>
            </Section>
            <Section title={__('DeviceDocumentSection')}>
              Work in progress
            </Section>
            <Section title={__('DevicePlatformSection')}>
              Work in progress
            </Section>
            <pre>
              {JSON.stringify(device, null, 2)}
            </pre>
          </form>
        </div>
    );
  }
}

DeviceEntryForm.propTypes = {
  handleSubmit: PropTypes.func,
  fields: PropTypes.object,
  invalid: PropTypes.bool,
  submitting: PropTypes.bool,
  device: PropTypes.object,
  className: PropTypes.string,
  confirmDeviceDelete: PropTypes.func,
  deviceUpdate: PropTypes.func,
  replace: PropTypes.func
};

export default reduxForm({
  form: 'deviceEntry',
  fields: ['name', 'alias', 'type'],
  validate: (values) => {
    return validate(values, Device, true);
  }
}, null, { confirmDeviceDelete, deviceUpdate, replace })(DeviceEntryForm);
