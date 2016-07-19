import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Button extends Component {
  handleClick(event) {
    if (this.props.onClick) this.props.onClick(event);
  }
  render() {
    const { className, children, disabled, div } = this.props;
    if (div) {
      return (
        <div
          className={classNames('button-component', className)}
          onClick={this.handleClick.bind(this)}
          disabled={disabled}
          ref={v => this.button = v}
        >
          {children}
        </div>
      );
    }
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
  disabled: PropTypes.bool,
  div: PropTypes.bool
};
