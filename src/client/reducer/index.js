import user from './user';
import device from './device';
import load from './load';
import entities from './entities';
import sidebar from './sidebar';
import init from './init';
import { routerReducer } from 'react-router-redux';
import { reducer as form } from 'redux-form';

export default {
  user, device, load, entities, sidebar, init, routing: routerReducer, form
};
