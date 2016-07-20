import React from 'react';

import { IndexRoute, Route } from 'react-router';
import App from './app';
import Register from './register';
import Index from './index';
import DeviceEntry from './deviceEntry';
import DocumentEntry from './documentEntry';
import DocumentEntryIndex from './document/index';
import DocumentEntryScript from './document/script';
import DocumentEntryConsole from './document/console';
import NewDocument from './newDocument';
import NewDevice from './newDevice';
import NewDevicePC from './newDevice/pc';
import NotFound from './notFound';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Index} />
    <Route path='register' component={Register} />
    <Route path='devices'>
      <IndexRoute component={NotFound} />
      <Route path=':name' component={DeviceEntry} />
    </Route>
    <Route path='documents'>
      <IndexRoute component={NotFound} />
      <Route path=':id' component={DocumentEntry}>
        <IndexRoute component={DocumentEntryIndex} />
        <Route path='script' component={DocumentEntryScript} />
        <Route path='console' component={DocumentEntryConsole} />
      </Route>
    </Route>
    <Route path='new'>
      <Route path='document' component={NewDocument} />
      <Route path='device'>
        <IndexRoute component={NewDevice} />
        <Route path='pc' component={NewDevicePC} />
      </Route>
    </Route>
    <Route path='*' component={NotFound} />
  </Route>
);
