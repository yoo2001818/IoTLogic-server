import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { load } from '../action/document';
import { register, unregister } from '../action/console';

import DropDown from '../component/ui/dropDown';
import AppContainer from '../container/appContainer';
import NotFound from './notFound';
import Loading from './loading';

import __ from '../lang';

function MenuEntry(props) {
  return (
    <li><Link to={props.href} activeClassName='active' onlyActiveOnIndex>
      {props.children}
    </Link></li>
  );
}

MenuEntry.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node
};

class DocumentEntry extends Component {
  componentDidMount() {
    this.docId = this.props.params.id;
    this.props.register(parseInt(this.props.params.id));
  }
  componentDidUpdate() {
    if (this.docId !== this.props.params.id) {
      this.props.unregister(parseInt(this.docId));
      this.docId = this.props.params.id;
      this.props.register(parseInt(this.props.params.id));
    }
  }
  componentWillUnmount() {
    this.props.unregister(parseInt(this.props.params.id));
  }
  render() {
    const { document, children } = this.props;
    if (document && document.devices !== undefined) {
      return (
        <AppContainer title={
          <DropDown title={document.name || __('Document')} href=''>
            <ul className='menu-list'>
              <MenuEntry href={`/documents/${document.id}`}>
                {__('DocumentInfoTitle')}
              </MenuEntry>
              <MenuEntry href={`/documents/${document.id}/script`}>
                {__('DocumentScriptTitle')}
              </MenuEntry>
              <MenuEntry href={`/documents/${document.id}/console`}>
                {__('DocumentConsoleTitle')}
              </MenuEntry>
            </ul>
          </DropDown>
        }>
          { cloneElement(children, { document })}
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
  document: PropTypes.object,
  children: PropTypes.node,
  register: PropTypes.func,
  unregister: PropTypes.func,
  params: PropTypes.object
};

const ConnectDocumentEntry = connect(
  (store, props) => ({
    document: store.entities.documents[props.params.id]
  }),
  { register, unregister }
)(DocumentEntry);

ConnectDocumentEntry.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(load(params.id));
};

export default ConnectDocumentEntry;
