import React, { Component } from 'react';

import AppContainer from '../container/appContainer';
import DocumentEntryForm from '../container/form/documentEntryForm';
import __ from '../lang';

export default class NewDocument extends Component {
  render() {
    return (
      <AppContainer title={__('NewDocumentTitle')}>
        <div className='document-entry-view general-view'>
          <DocumentEntryForm className='content noborder-input'
            formKey='newDocument' creating
          />
        </div>
      </AppContainer>
    );
  }
}
