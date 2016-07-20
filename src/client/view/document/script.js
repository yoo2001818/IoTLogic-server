import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadWorkspace, updateWorkspace, confirmUpdatePayload,
  confirmDeleteWorkspace } from '../../action/document';

import Button from '../../component/ui/button';

// import brace from 'brace';
import AceEditor from 'react-ace';

import __ from '../../lang';

import 'brace/mode/scheme';
import 'brace/theme/tomorrow_night';

class DocumentEntryScript extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null
    };
  }
  handleSave() {
    if (this.state.code === null) return;
    this.props.updateWorkspace(this.props.document.id, this.state.code);
  }
  handleReset() {
    this.props.confirmDeleteWorkspace(this.props.document);
  }
  handleUpload() {
    this.props.confirmUpdatePayload(this.props.document, undefined);
  }
  handleChange(value) {
    this.setState({code: value});
  }
  componentWillReceiveProps(props) {
    if (props.document &&
      props.document !== this.props.document
    ) {
      this.setState({code: null});
    }
  }
  render() {
    const { document } = this.props;
    if (document.workspace === undefined) {
      return (
        <div className='loading-view'>
          <div className='header'>
            <span className='load-icon' />
          </div>
        </div>
      );
    }
    let code = this.state.code != null ? this.state.code : document.workspace;
    return (
      <div className='script-view'>
        <div className='menu'>
          <Button
            onClick={this.handleSave.bind(this)}
            disabled={code === document.workspace}
          >
            <span className='save-icon icon-right' />{__('Save')}
          </Button>
          <Button className='orange'
            onClick={this.handleReset.bind(this)}
          >
            <span className='undo-icon icon-right' />{__('ScriptReset')}
          </Button>
          <Button className='green'
            onClick={this.handleUpload.bind(this)}
            disabled={code !== document.workspace}
          >
            <span className='upload-icon icon-right' />{__('ScriptDeploy')}
          </Button>
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
            value={code}
            onChange={this.handleChange.bind(this)}
            commands={[{
              name: 'save',
              bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
              exec: this.handleSave.bind(this)
            }]}
          />
        </div>
      </div>
    );
  }
}

DocumentEntryScript.propTypes = {
  document: PropTypes.object,
  updateWorkspace: PropTypes.func,
  confirmUpdatePayload: PropTypes.func,
  confirmDeleteWorkspace: PropTypes.func
};

const ConnectDocumentEntryScript = connect(null,
  { loadWorkspace, updateWorkspace, confirmUpdatePayload,
    confirmDeleteWorkspace }
)(DocumentEntryScript);

ConnectDocumentEntryScript.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(loadWorkspace(params.id));
};

export default ConnectDocumentEntryScript;
