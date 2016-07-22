import React, { Component, PropTypes } from 'react';

import AppContainer from '../../container/appContainer';
import DeviceEntryForm from '../../container/form/deviceEntryForm';
import __ from '../../lang';

export default class NewDeviceForm extends Component {
  render() {
    const { params } = this.props;
    return (
      <AppContainer title={__('NewDeviceTitle')}>
        <div className='device-entry-view general-view'>
          <DeviceEntryForm className='content noborder-input'
            formKey='newDevice' creating
            initialValues={{
              type: params.type
            }}
          />
        </div>
      </AppContainer>
    );
  }
}

NewDeviceForm.propTypes = {
  params: PropTypes.object
};
