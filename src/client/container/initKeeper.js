import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import FullOverlay from '../component/ui/fullOverlay';

class InitKeeper extends Component {
  render() {
    const { loaded, children } = this.props;
    if (!loaded) {
      return (
        <FullOverlay transparent center>
          <span className='load-icon big' />
        </FullOverlay>
      );
    }
    return children;
  }
}

InitKeeper.propTypes = {
  loaded: PropTypes.bool,
  children: PropTypes.node
};

export default connect(
  state => ({
    loaded: state.init.loaded,
  })
)(InitKeeper);
