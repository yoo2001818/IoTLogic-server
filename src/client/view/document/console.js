import React, { Component, PropTypes } from 'react';

export default class DocumentEntryConsole extends Component {
  render() {
    return (
      <div className='document-entry-view general-view'>
        <div className='content'>
          Console
        </div>
      </div>
    );
  }
}

DocumentEntryConsole.propTypes = {
  document: PropTypes.object
};
