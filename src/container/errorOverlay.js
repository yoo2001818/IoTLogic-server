import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import FullOverlay from '../component/ui/fullOverlay';
import Dialog from '../component/ui/dialog';
import Button from '../component/ui/button';

import { errorDismiss } from '../action/load';
import __ from '../lang';

class ErrorOverlay extends Component {
  componentDidMount() {
    this.handleFocus();
  }
  componentDidUpdate() {
    this.handleFocus();
  }
  handleFocus() {
    const { error } = this.props;
    if (!error) return;
    console.log(this.dismissBtn);
    this.dismissBtn.focus();
  }
  render() {
    const { errorDismiss, error } = this.props;
    if (!error) return false;
    let errorMsg = error.body;
    // Sometimes server returns JSON object as an error, so we'll have to
    // do this to display an error message. Otherwise, it'll just return
    // [Object object], which is pretty bad for debugging.
    // Or, we could use JSON.stringify? I think that's pretty bad though.
    if (error.body.message) {
      errorMsg = error.body.message;
    }
    return (
      <FullOverlay filter>
        <Dialog title={__('ErrorTitle')}>
          <p>{errorMsg + ' @ ' + error.type}</p>
          <Button onClick={errorDismiss} ref={ref => this.dismissBtn = ref}>
            {__('Dismiss')}
          </Button>
        </Dialog>
      </FullOverlay>
    );
  }
}

ErrorOverlay.propTypes = {
  errorDismiss: PropTypes.func.isRequired,
  error: PropTypes.object
};

export default connect(
  state => state.load,
  { errorDismiss })(ErrorOverlay);
