import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import __ from '../lang';

import Section from '../component/ui/section';

class DocumentErrorList extends Component {
  render() {
    if (!(this.props.documentPush && this.props.documentPush.errors &&
      this.props.documentPush.errors.length > 0)
    ) {
      if (this.props.document && this.props.document.errors &&
        this.props.document.errors.length > 0
      ) {
        return (
          <Section title={__('DocumentErrorSection')}>
            <code><pre className='error-log'>
              {this.props.document.errors.join('\n')}
            </pre></code>
          </Section>
        );
      }
      return false;
    }
    return (
      <Section title={__('DocumentErrorSection')}>
        <code><pre className='error-log'>
          {this.props.documentPush.errors.join('\n')}
        </pre></code>
      </Section>
    );
  }
}

DocumentErrorList.propTypes = {
  document: PropTypes.object,
  documentPush: PropTypes.object
};

export default connect((state, props) => ({
  documentPush: state.entities.documentPush[props.document.id]
}))(DocumentErrorList);
