import React, { Component } from 'react';
import LoginKeeper from '../container/loginKeeper';

import __ from '../lang';

export default class Index extends Component {
  render() {
    return (
      <LoginKeeper introduction>
        <div className='index-view'>
          <div className='content'>
            {__('IndexDescription')}
          </div>
        </div>
      </LoginKeeper>
    );
  }
}
