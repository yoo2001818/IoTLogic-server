import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

export default class DocumentSpan extends Component {
  render() {
    const { id, name, state, running, errors } = this.props.document;
    return (
      <Link className='document-span'
        activeClassName='active'
        to={`/documents/${id}`}
      >
        <span className='name'>{name}</span>
        <span className={classNames('state-marker',
          { start: state === 'start' })} />
        <span className={classNames('pause-marker',
          { paused: state === 'start' && !running })} />
        <span className={classNames('error-marker', { error:
          running && errors && errors.length > 0 })} />
      </Link>
    );
  }
}

DocumentSpan.propTypes = {
  document: PropTypes.object
};
