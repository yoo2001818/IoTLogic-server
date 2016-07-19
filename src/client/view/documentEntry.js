import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { load } from '../action/document';

import AppContainer from '../container/appContainer';
import NotFound from './notFound';
import Loading from './loading';

import __ from '../lang';

class DocumentEntry extends Component {
  render() {
    const { document } = this.props;
    if (document && document.devices !== undefined) {
      return (
        <AppContainer title={document.name || __('Document')}>
          <div className='document-entry-view general-view'>
            <div className='content'>
              <pre>
                {JSON.stringify(document, null, 2)}
              </pre>
            </div>
          </div>
        </AppContainer>
      );
    } else if (document === null) {
      return <NotFound />;
    } else {
      return <Loading />;
    }
  }
}

DocumentEntry.propTypes = {
  document: PropTypes.object
};

const ConnectDocumentEntry = connect(
  (store, props) => ({
    document: store.entities.documents[props.params.id]
  })
)(DocumentEntry);

ConnectDocumentEntry.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(load(params.id));
};

export default ConnectDocumentEntry;
