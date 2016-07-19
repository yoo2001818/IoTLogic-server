import React, { Component, PropTypes } from 'react';

export default class DocumentEntryScript extends Component {
  render() {
    return (
      <div className='document-entry-view general-view'>
        <div className='content'>
          Script
        </div>
      </div>
    );
  }
}

DocumentEntryScript.propTypes = {
  document: PropTypes.object
};
