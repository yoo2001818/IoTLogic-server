import React, { Component, PropTypes } from 'react';

export default class SidebarHeader extends Component {
  render() {
    const { left, center, right } = this.props;
    return (
      <div className='sidebar-header-component'>
        <div className='content'>
          <div className='left'>
            { left }
          </div>
          <div className='center'>
            { center }
          </div>
          <div className='right'>
            { right }
          </div>
        </div>
      </div>
    );
  }
}

SidebarHeader.propTypes = {
  left: PropTypes.node,
  center: PropTypes.node,
  right: PropTypes.node
};
