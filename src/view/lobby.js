import React, { Component } from 'react';
import LoginKeeper from '../container/loginKeeper';

export default class Lobby extends Component {
  render() {
    return (
      <LoginKeeper introduction>
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
      </LoginKeeper>
    );
  }
}
