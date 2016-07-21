import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AppContainer from '../container/appContainer';
import ProfileForm from '../container/form/profileForm';
import PasswordForm from '../container/form/passwordForm';

import Section from '../component/ui/section';

import __ from '../lang';

class Setting extends Component {
  render() {
    const { user } = this.props;
    return (
      <AppContainer title={__('UserSettingTitle')}>
        <div className='user-setting-view general-view'>
          <div className='content'>
            <Section title={__('UserProfileSection')}>
              <ProfileForm className='content noborder-input'
                initialValues={user} />
            </Section>
            <Section title={__('UserPasswordSection')}>
              <PasswordForm className='content noborder-input' />
            </Section>
          </div>
        </div>
      </AppContainer>
    );
  }
}

Setting.propTypes = {
  user: PropTypes.object
};

export default connect(state => ({
  user: state.entities.users[state.user.username]
}))(Setting);
