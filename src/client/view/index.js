import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import LoginKeeper from '../container/loginKeeper';
import AppContainer from '../container/appContainer';

import Section from '../component/ui/section';
import DeviceSpan from '../component/deviceSpan';
import DocumentSpan from '../component/documentSpan';

import __ from '../lang';

class Index extends Component {
  render() {
    return (
      <LoginKeeper introduction>
        <AppContainer title={__('IndexTitle')}>
          <div className='index-view general-view'>
            <div className='content'>
              <Section title={__('IndexTitle')}>
                <p>{__('IndexDescription')}</p>
              </Section>
              <Section title={__('DevicesTitle')}>
                {this.props.devices.length === 0 && (
                  <p className='tip'>{__('DeviceListEmptyTip')}</p>
                )}
                <ul className='device-list'>
                  {
                    this.props.devices.map(device => (
                      <li key={device.id}><DeviceSpan device={device} /></li>
                    ))
                  }
                </ul>
              </Section>
              <Section title={__('DocumentsTitle')}>
                {this.props.documents.length === 0 && (
                  <p className='tip'>{__('DocumentListEmptyTip')}</p>
                )}
                <ul className='document-list'>
                  {
                    this.props.documents.map(document => (
                      <li key={document.id}>
                        <DocumentSpan document={document} />
                      </li>
                    ))
                  }
                </ul>
              </Section>
            </div>
          </div>
        </AppContainer>
      </LoginKeeper>
    );
  }
}

Index.propTypes = {
  devices: PropTypes.array,
  documents: PropTypes.array
};

const ConnectIndex = connect(state => ({
  devices: (state.device.list || []).map(v => state.entities.devices[v]),
  documents: (state.document.list || []).map(v => state.entities.documents[v])
}))(Index);

ConnectIndex.noLogin = true;

export default ConnectIndex;
