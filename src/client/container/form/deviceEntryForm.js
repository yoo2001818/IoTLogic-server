import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import classNames from 'classnames';

import { confirmDeviceDelete, update as deviceUpdate, create as deviceCreate }
  from '../../action/device';
import { replace, push } from 'react-router-redux';

import { Device } from '../../../validation/schema';
import validate from '../../../validation/validate';

import Section from '../../component/ui/section';
import Field from '../../component/ui/field';
import Button from '../../component/ui/button';
import ErrorInput from '../../component/ui/errorInput';
import ListInput from '../../component/ui/listInput';

import DocumentSpan from '../../component/documentSpan';

import __ from '../../lang';
import capitalize from '../../util/capitalize';

class DeviceEntryForm extends Component {
  handleDelete(e) {
    e.preventDefault();
    this.props.confirmDeviceDelete(this.props.device);
  }
  handleSubmit(values) {
    if (this.props.creating) {
      return this.props.deviceCreate(values)
      .then(action => {
        if (!action.error) {
          this.props.push('/devices/' + action.payload.result);
          return action;
        }
        throw {
          [action.payload.body.field]: {
            name: action.payload.body.type
          }
        };
      });
    }
    let changed = values.name !== undefined &&
      this.props.device.name !== values.name;
    return this.props.deviceUpdate(this.props.device.name, values)
    .then(action => {
      if (!action.error) {
        if (changed) {
          this.props.replace('/devices/' + action.payload.result);
        }
        return action;
      }
      throw {
        [action.payload.body.field]: {
          name: action.payload.body.type
        }
      };
    });
  }
  handleReset(e) {
    e.preventDefault();
    this.props.resetForm();
  }
  render() {
    const { fields: { name, alias, type, data },
      handleSubmit, invalid, submitting, device, className, dirty, documents,
      creating }
      = this.props;
    const onSubmit = handleSubmit(this.handleSubmit.bind(this));
    if (!creating && device == null) return false;
    return (
        <div className={classNames('device-entry-form', className)}>
          <form onSubmit={onSubmit}>
            <Section title={__('InfoSection')}>
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
              {!creating && (
                <Field label={__('DeviceConnectedLabel')}>
                  <div className='readonly'>
                    {device.connected ? __('DeviceConnected') :
                      __('DeviceDisconnected')}
                  </div>
                </Field>
              )}
              {!creating && (
                <Field label={__('CreatedDateLabel')}>
                  <div className='readonly'>
                    {new Date(device.createdAt).toLocaleString()}
                  </div>
                </Field>
              )}
              <div className='section-action'>
                {!creating && (
                  <Button className='red' div noFocus
                    onClick={this.handleDelete.bind(this)}
                  >
                    <span className='trash-icon icon-right' />
                    {__('DeviceDelete')}
                  </Button>
                )}
                <Button onClick={onSubmit} disabled={!dirty || invalid ||
                  submitting}
                >
                  <span className='check-icon icon-right'  />
                  {creating ? __('Create') : __('Save')}
                </Button>
              </div>
            </Section>
            {!creating && device.errors && device.errors.length > 0 && (
              <Section title={__('DeviceErrorSection')}>
                <code><pre className='error-log'>
                  {device.errors.join('\n')}
                </pre></code>
              </Section>
            )}
            {!creating && (
              <Section title={__('DeviceDocumentSection')}>
                {documents.length === 0 && (
                  <p className='tip'>{__('DeviceDocumentListEmptyTip')}</p>
                )}
                <ul className='device-list'>
                  {documents.map(document => (
                    <li key={document.id}>
                      <DocumentSpan document={document} />
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {!creating && device.type === 'pc' && (
              <Section title={__('AsyncIOPackagesLabel')}>
                <ListInput {...data}
                  value={Array.isArray(data.value) ? data.value : []}
                />
                <div className='section-action'>
                  {dirty && (
                    <Button className='orange' div
                      onClick={this.handleReset.bind(this)}
                    >
                      <span className='undo-icon icon-right' />
                      {__('Revert')}
                    </Button>
                  )}
                  <Button onClick={onSubmit} disabled={!dirty || invalid ||
                    submitting}
                  >
                    <span className='check-icon icon-right'  />
                    {__('Save')}
                  </Button>
                </div>
              </Section>
            )}
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
  dirty: PropTypes.bool,
  device: PropTypes.object,
  documents: PropTypes.array,
  className: PropTypes.string,
  confirmDeviceDelete: PropTypes.func,
  deviceUpdate: PropTypes.func,
  replace: PropTypes.func,
  deviceCreate: PropTypes.func,
  push: PropTypes.func,
  resetForm: PropTypes.func,
  creating: PropTypes.bool
};

export default reduxForm({
  form: 'deviceEntry',
  fields: ['name', 'alias', 'type', 'data'],
  validate: (values) => {
    return validate(values, Device, true);
  }
}, (state, props) => ({
  documents: ((props.device && props.device.documents) || []).map(
    v => state.entities.documents[v])
}), { confirmDeviceDelete, deviceUpdate,
  deviceCreate, replace, push })(DeviceEntryForm);
