import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { answer } from '../action/modal';
import __ from '../lang';
import FullOverlay from '../component/ui/fullOverlay';
import Dialog from '../component/ui/dialog';
import Button from '../component/ui/button';

class ModalOverlay extends Component {
  handleDismiss(choice) {
    this.props.answer(choice);
  }
  render() {
    const { modal: { open, title, body, choices } } = this.props;
    if (!open) return false;
    let translatedBody = body;
    if (body.key) {
      translatedBody = __(body.key, body.value);
    }
    return (
      <FullOverlay filter>
        <Dialog title={__(title)}>
          <p>{ translatedBody }</p>
          <div className='action'>
            { choices.map((choice, key) => (
              <Button onClick={this.handleDismiss.bind(this, key)}
                className={choice.type} key={key}
              >
                {__(choice.name)}
              </Button>
            ))}
          </div>
        </Dialog>
      </FullOverlay>
    );
  }
}

ModalOverlay.propTypes = {
  lang: PropTypes.object,
  modal: PropTypes.object.isRequired,
  answer: PropTypes.func.isRequired
};

export default connect(
  (state) => ({ modal: state.modal }),
  { answer }
)(ModalOverlay);
