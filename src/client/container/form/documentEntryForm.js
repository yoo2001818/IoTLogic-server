import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import classNames from 'classnames';

import { confirmDocumentDelete, update as documentUpdate }
  from '../../action/document';

import { Document } from '../../../validation/schema';
import validate from '../../../validation/validate';

import Section from '../../component/ui/section';
import Field from '../../component/ui/field';
import Button from '../../component/ui/button';
import ErrorInput from '../../component/ui/errorInput';
import SelectInput from '../../component/ui/selectInput';

import __ from '../../lang';

class DocumentEntryForm extends Component {
  handleDelete(e) {
    e.preventDefault();
    this.props.confirmDocumentDelete(this.props.document);
  }
  handleSubmit(values) {
    return this.props.documentUpdate(this.props.document.id, values);
  }
  render() {
    const { fields: { name, visibility, state, devices },
      handleSubmit, invalid, submitting, className, dirty, document }
      = this.props;
    const onSubmit = handleSubmit(this.handleSubmit.bind(this));
    if (document == null) return false;
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
                <SelectInput {...state} options={[
                  {value: 'start', label: __('DocumentStatusStart'),
                    className: 'green'},
                  {value: 'stop', label: __('DocumentStatusStop'),
                    className: 'red'},
                ]} />
              </Field>
              <Field label={__('DocumentVisibility')}>
                <SelectInput {...visibility} options={[
                  {value: 'public', label: __('DocumentVisibilityPublic')},
                  {value: 'private', label: __('DocumentVisibilityPrivate')},
                ]} />
              </Field>
              <Field label={__('CreatedDateLabel')}>
                <div className='readonly'>
                  {new Date(document.createdAt).toLocaleString()}
                </div>
              </Field>
              <div className='section-action'>
                <Button className='red' div
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
            </Section>
            <Section title={__('DocumentDocumentSection')}>
              <ul className='device-list'>
              </ul>
            </Section>
            {/*
            <Section title={__('DocumentPlatformSection')}>
              Work in progress
            </Section>
            */}
            <pre>
              {JSON.stringify(document, null, 2)}
            </pre>
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
  documentUpdate: PropTypes.func
};

export default reduxForm({
  form: 'documentEntry',
  fields: ['name', 'devices', 'visibility', 'state'],
  initialValues: {
    visibility: 'private',
    state: 'stop'
  },
  validate: (values) => {
    return validate(values, Document, true);
  }
}, (state, props) => {
  console.log(props);
  return {};
}, { confirmDocumentDelete, documentUpdate })(DocumentEntryForm);
