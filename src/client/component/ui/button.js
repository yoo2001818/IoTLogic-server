import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Button extends Component {
  handleClick(event) {
    if (this.props.onClick) this.props.onClick(event);
  }
  render() {
    const { className, children, disabled } = this.props;
    return (
      <button
        className={classNames('button-component', className)}
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
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};
