import React, { Component, PropTypes } from 'react';

export default class DocumentEntryIndex extends Component {
  render() {
    const { document } = this.props;
    return (
      <div className='document-entry-view general-view'>
        <div className='content'>
          <pre>
            {JSON.stringify(document, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
}

DocumentEntryIndex.propTypes = {
  document: PropTypes.object
};
