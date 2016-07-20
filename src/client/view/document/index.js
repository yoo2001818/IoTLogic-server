import React, { Component, PropTypes } from 'react';

import DocumentEntryForm from '../../container/form/documentEntryForm';

export default class DocumentEntryIndex extends Component {
  render() {
    const { document } = this.props;
    return (
      <div className='document-entry-view general-view'>
        <DocumentEntryForm className='content noborder-input'
          initialValues={document} formKey={'id/'+document.id}
          document={document}
        />
      </div>
    );
  }
}

DocumentEntryIndex.propTypes = {
  document: PropTypes.object
};
