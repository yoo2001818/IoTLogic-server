import React from 'react';

import { IndexRoute, Route } from 'react-router';
import App from './app';
import Register from './register';
import Index from './index';
import NotFound from './notFound';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Index} />
    <Route path='register' component={Register} />
    <Route path='*' component={NotFound} />
  </Route>
);
