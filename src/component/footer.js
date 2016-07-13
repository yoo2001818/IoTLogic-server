import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Footer extends Component {
  render() {
    const { fixed } = this.props;
    return (
      <div className={classNames('footer-component', { fixed })}>
        Copyright &copy; Duknam Yoo. All rights reserved.
      </div>
    );
  }
}

Footer.propTypes = {
  fixed: PropTypes.bool
};
