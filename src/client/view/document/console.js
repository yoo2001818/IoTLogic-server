import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { restart, clearLog, evaluateLog } from '../../action/document';

import Button from '../../component/ui/button';
import __ from '../../lang';

class DocumentEntryConsole extends Component {
  handleReset() {
    this.props.restart(this.props.document);
  }
  handleClear() {
    this.props.clearLog(this.props.document);
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      if (e.shiftKey) return;
      if (this.inputNode.value.trim() === '') return;
      this.props.evaluateLog(this.props.document, this.inputNode.value);
      this.inputNode.value = '';
      this.handleKeyUp();
      e.preventDefault();
    }
  }
  handleKeyUp() {
    this.inputNode.style.height = '5px';
    this.inputNode.style.height = (this.inputNode.scrollHeight) + 'px';
    if (this.inputNode.scrollHeight > 150) {
      this.inputNode.style.overflow = 'auto';
    } else {
      this.inputNode.style.overflow = 'hidden';
    }
  }

  componentDidMount() {
    this.consoleNode.scrollTop = this.consoleNode.scrollHeight;
    this.handleKeyUp();
  }
  componentWillUpdate() {
    let node = this.consoleNode;
    this.shouldScrollBottom =
      Math.abs(node.scrollTop + node.offsetHeight - node.scrollHeight) < 50;
  }
  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      this.consoleNode.scrollTop = this.consoleNode.scrollHeight;
    }
  }

  render() {
    return (
      <div className='console-view'>
        <div className='menu'>
          <Button className='orange'
            onClick={this.handleReset.bind(this)}
          >
            <span className='undo-icon icon-right' />{__('Restart')}
          </Button>
          <Button
            onClick={this.handleClear.bind(this)}
          >
            <span className='times-icon icon-right' />{__('ClearLog')}
          </Button>
        </div>
        <div className='console'
          ref={node => this.consoleNode = node}
        >
          <pre>
            { (this.props.documentPush && this.props.documentPush.console)
            || '' }
          </pre>
        </div>
        <div className='input'>
          <textarea className='code-input'
            defaultValue=''
            placeholder={__('ConsoleInputPlaceholder')}
            ref={node => this.inputNode = node}
            onKeyDown={this.handleKeyDown.bind(this)}
            onKeyUp={this.handleKeyUp.bind(this)}
            disabled={!this.props.document.running}
          />
        </div>
      </div>
    );
  }
}

DocumentEntryConsole.propTypes = {
  documentPush: PropTypes.object,
  document: PropTypes.object,
  restart: PropTypes.func,
  clearLog: PropTypes.func,
  evaluateLog: PropTypes.func
};

export default connect((state, props) => ({
  documentPush: state.entities.documentPush[props.document.id]
}), { restart, clearLog,
  evaluateLog })(DocumentEntryConsole);
