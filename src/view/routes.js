import React from 'react';

import { IndexRoute, Route } from 'react-router';
import App from './app';
import Lobby from './lobby';
import NotFound from './notFound';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Lobby} />
    <Route path='*' component={NotFound} />
  </Route>
);
