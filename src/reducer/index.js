import session from './session.js';
import load from './load.js';
import modal from './modal.js';
import entities from './entities.js';
import sidebar from './sidebar';
import { routerReducer } from 'react-router-redux';
// import { reducer as form } from 'redux-form';

export default {
  session, load, modal, entities, sidebar, routing: routerReducer
};
