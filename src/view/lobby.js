import React, { Component } from 'react';
import AppContainer from '../container/appContainer';
import __ from '../lang';

export default class Lobby extends Component {
  render() {
    return (
      <AppContainer
        title={__('RoomListTitle')}
      >
        <div className='lobby-view two-column-view'>
          <div className='list-column'>
            O.O
          </div>
          <div className='details-column'>
            {/* We display nothing in this column, as the room entry will
              * expand to this column.
              */}
          </div>
        </div>
      </AppContainer>
    );
  }
}
