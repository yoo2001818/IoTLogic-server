import { createAction } from 'redux-actions';
import { arrayOf } from 'normalizr';
import { Device } from '../schema/index';
import { api, GET, POST, DELETE } from '../middleware/api';

export const FETCH_LIST = 'device/fetchList';
export const FETCH = 'device/fetch';
export const DELETE_DEVICE = 'device/delete';
export const CREATE = 'device/create';
export const UPDATE = 'device/update';

export const fetchList = createAction(FETCH_LIST,
  () => api(GET, '/devices', {}),
  () => ({
    schema: arrayOf(Device)
  }));
export const fetch = createAction(FETCH,
  (device) => api(GET, `/devices/${device.name}`, {}),
  () => ({
    schema: Device
  }));
export const deleteDevice = createAction(DELETE_DEVICE,
  (device) => api(DELETE, `/devices/${device.name}`, {}),
  () => ({
    schema: Device
  }));
export const create = createAction(CREATE,
  (device) => api(POST, '/devices', {
    body: device
  }),
  () => ({
    schema: Device
  }));
export const update = createAction(UPDATE,
  (device) => api(POST, `/devices/${device.name}`, {
    body: device
  }),
  () => ({
    schema: Device
  }));

export function load(name) {
  return (dispatch, getState) => {
    const { entities: { entries } } = getState();
    const entry = entries[name];
    if (entry != null && entry.documents !== undefined &&
      new Date().valueOf() - entry.loadedAt < 20000
    ) {
      return Promise.resolve();
    }
    return dispatch(fetch({ name }));
  };
}

export function loadList() {
  return (dispatch, getState) => {
    const device = getState().device;
    if (!device.loaded) return dispatch(fetchList());
    return Promise.resolve();
  };
}
