import React, { Component, PropTypes } from 'react';

export default class Section extends Component {
  render() {
    const { title, children } = this.props;
    return (
      <section className='section-component'>
        <h1 className='title'>
          {title}
        </h1>
        <div className='content'>
          {children}
        </div>
      </section>
    );
  }
}

Section.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node
};
