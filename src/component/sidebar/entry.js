import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class SidebarEntry extends Component {
  render() {
    const { title, hideHeader, children, className } = this.props;
    return (
      <section
        className={classNames('sidebar-entry', className)}
      >
        { hideHeader || (
          <div className='header'>
            <h1>{title}</h1>
          </div>
        )}
        <div className='content'>
          {children}
        </div>
      </section>
    );
  }
}

SidebarEntry.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  hideHeader: PropTypes.bool,
  children: PropTypes.node
};
