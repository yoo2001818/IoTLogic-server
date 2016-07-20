import React, { Component, PropTypes } from 'react';

// import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/scheme';
import 'brace/theme/tomorrow_night';

export default class DocumentEntryScript extends Component {
  render() {
    return (
      <div className='script-view'>
        <div className='menu'>
          저장 초기화 올리기
        </div>
        <div className='editor'>
          <AceEditor
            mode='scheme'
            theme='tomorrow_night'
            name='document-entry-script-editor'
            tabSize={2}
            fontSize={18}
            width='100%'
            height='100%'
            editorProps={{$blockScrolling: true}}
            enableBasicAutocompletion
          />
        </div>
      </div>
    );
  }
}

DocumentEntryScript.propTypes = {
  document: PropTypes.object
};
