import React, { Component, PropTypes } from 'react';

export default class Button extends Component {
  handleClick(event) {
    if (this.props.onClick) this.props.onClick(event);
  }
  render() {
    const { children, disabled } = this.props;
    return (
      <button
        className='button-component'
        onClick={this.handleClick.bind(this)}
        disabled={disabled}
        ref={v => this.button = v}
      >
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};
