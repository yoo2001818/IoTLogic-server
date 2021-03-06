import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import classNames from 'classnames';

import { confirmDocumentDelete, update as documentUpdate, updatePayload,
  create as documentCreate } from '../../action/document';
import { push } from 'react-router-redux';

import { Document } from '../../../validation/schema';
import validate from '../../../validation/validate';

import Section from '../../component/ui/section';
import Field from '../../component/ui/field';
import Button from '../../component/ui/button';
import ErrorInput from '../../component/ui/errorInput';
import DropDown from '../../component/ui/dropDown';
import SelectInput from '../../component/ui/selectInput';
import DeviceList from '../deviceList';
import DocumentErrorList from '../documentErrorList';

import __ from '../../lang';

class DocumentEntryForm extends Component {
  handleDelete(e) {
    e.preventDefault();
    this.props.confirmDocumentDelete(this.props.document);
  }
  handleSubmit(values) {
    if (this.props.creating) {
      return this.props.documentCreate(values)
      .then(action => {
        if (action.error) return;
        console.log(action);
        this.props.push(`/documents/${action.payload.result}`);
      });
    }
    return this.props.documentUpdate(this.props.document.id, values);
  }
  handleReset(e) {
    e.preventDefault();
    this.props.resetForm();
  }
  handleUpload() {
    let fileList = this.fileInput.files;
    if (fileList.length === 0) return;
    let file = fileList[0];
    let reader = new FileReader();
    reader.onload = () => {
      if (!reader.result) return;
      this.props.updatePayload(this.props.document.id, reader.result);
    };
    reader.readAsText(file);
  }
  render() {
    const { fields: { name, state, devices },
      handleSubmit, invalid, submitting, className, dirty, document, creating }
      = this.props;
    const onSubmit = handleSubmit(this.handleSubmit.bind(this));
    if (document == null && !creating) return false;
    return (
        <div className={classNames('document-entry-form', className)}>
          <form onSubmit={onSubmit}>
            <Section title={__('InfoSection')}>
              <Field label={__('DocumentNameLabel')}>
                <ErrorInput type='text' placeholder={__('DocumentNameLabel')}
                  {...name}
                />
              </Field>
              <Field label={__('DocumentStatus')}>
                <DropDown title={state.value === 'start' ?
                  __('DocumentStatusStart') : __('DocumentStatusStop')}
                  className='status-drop-down left'
                >
                  <SelectInput {...state} options={[
                    {value: 'start', label: __('DocumentStatusStart'),
                      className: 'green'},
                    {value: 'stop', label: __('DocumentStatusStop'),
                      className: 'red'},
                  ]} className='menu-list' />
                </DropDown>
              </Field>
              {/*Field label={__('DocumentVisibility')}>
                <SelectInput {...visibility} options={[
                  {value: 'public', label: __('DocumentVisibilityPublic')},
                  {value: 'private', label: __('DocumentVisibilityPrivate')},
                ]} />
              </Field>*/}
              {!creating && (
                <Field label={__('RunningLabel')}>
                  <div className='readonly'>
                    {document.state !== 'start' ? (
                      __('DocumentRunningStopped')
                    ) : (
                      document.running ? (
                        __('DocumentRunningStarted')
                      ) : (
                        __('DocumentRunningWait')
                      )
                    )}
                  </div>
                </Field>
              )}
              {!creating && (
                <Field label={__('CreatedDateLabel')}>
                  <div className='readonly'>
                    {new Date(document.createdAt).toLocaleString()}
                  </div>
                </Field>
              )}
              {!creating && (
                <div className='section-action'>
                    <Button className='red' div noFocus
                      onClick={this.handleDelete.bind(this)}
                    >
                      <span className='trash-icon icon-right' />
                      {__('DocumentDelete')}
                    </Button>
                  <Button onClick={onSubmit} disabled={!dirty || invalid ||
                    submitting}
                  >
                    <span className='check-icon icon-right'  />
                    {__('Save')}
                  </Button>
                </div>
              )}
            </Section>
            {!creating && (
              <DocumentErrorList document={document} />
            )}
            {!creating && (
              <Section title={__('DocumentSourceSection')}>
                <p className='tip'>{__('DocumentSourceSectionHelp')}</p>
                <div className='section-action'>
                  <label>
                    <input type='file' className='file-input'
                      accept='.txt,.scm,.scheme,.ss'
                      ref={input => this.fileInput = input}
                      onChange={this.handleUpload.bind(this)}
                    />
                    <Button className='orange' div>
                      <span className='upload-icon icon-right' />
                      {__('SourceUpload')}
                    </Button>
                  </label>
                  <Button className='green'
                    href={`/api/documents/${document.id}/payload`}
                  >
                    <span className='download-icon icon-right' />
                    {__('SourceDownload')}
                  </Button>
                </div>
              </Section>
            )}
            <Section title={__('DocumentDeviceSection')}>
              <DeviceList {...devices} />
              <div className='section-action'>
                {dirty && !creating && (
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
                  {creating ? __('Create') : __('Save')}
                </Button>
              </div>
            </Section>
          </form>
        </div>
    );
  }
}

DocumentEntryForm.propTypes = {
  handleSubmit: PropTypes.func,
  fields: PropTypes.object,
  invalid: PropTypes.bool,
  submitting: PropTypes.bool,
  dirty: PropTypes.bool,
  document: PropTypes.object,
  className: PropTypes.string,
  confirmDocumentDelete: PropTypes.func,
  documentUpdate: PropTypes.func,
  documentCreate: PropTypes.func,
  updatePayload: PropTypes.func,
  resetForm: PropTypes.func,
  push: PropTypes.func,
  creating: PropTypes.bool
};

export default reduxForm({
  form: 'documentEntry',
  fields: ['name', 'devices', 'visibility', 'state'],
  initialValues: {
    visibility: 'private',
    state: 'stop',
    devices: [],
    name: ''
  },
  validate: (values) => {
    return validate(values, Document, true);
  }
}, null, { confirmDocumentDelete, documentUpdate,
  updatePayload, documentCreate, push }
)(DocumentEntryForm);
