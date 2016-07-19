import { createAction } from 'redux-actions';
import { arrayOf } from 'normalizr';
import { Device } from '../schema/index';
import { api, GET, POST, DELETE } from '../middleware/api';
import { open as modalOpen } from './modal';
import { goBack } from 'react-router-redux';

export const FETCH_LIST = 'device/fetchList';
export const FETCH = 'device/fetch';
export const DEVICE_DELETE = 'device/delete';
export const CREATE = 'device/create';
export const UPDATE = 'device/update';

export const fetchList = createAction(FETCH_LIST,
  () => api(GET, '/devices', {}),
  () => ({
    errors: [401],
    schema: arrayOf(Device)
  }));
export const fetch = createAction(FETCH,
  (device) => api(GET, `/devices/${device}`, {}),
  (device) => ({
    replace: {
      devices: {
        [device]: null
      }
    },
    errors: [401, 404],
    schema: Device
  }));
export const deviceDelete = createAction(DEVICE_DELETE,
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
  (name, device) => api(POST, `/devices/${name}`, {
    body: device
  }),
  (name, device) => {
    if (name === device.name || device.name === undefined) {
      return {
        schema: Device
      };
    }
    return {
      append: {
        devices: {
          [name]: {
            deleted: true
          }
        }
      },
      previous: name,
      schema: Device
    };
  });

export function load(name) {
  return (dispatch, getState) => {
    const { entities: { devices } } = getState();
    const entry = devices[name];
    if (entry != null && entry.documents !== undefined &&
      // Push notification is not done yet
      new Date().valueOf() - entry.loadedAt < 0
    ) {
      return Promise.resolve();
    }
    return dispatch(fetch(name));
  };
}

export function loadList() {
  return (dispatch, getState) => {
    const device = getState().device;
    if (device.load && device.load.loading) return Promise.resolve();
    if (!device.loaded) return dispatch(fetchList());
    return Promise.resolve();
  };
}

export function confirmDeviceDelete(device) {
  return (dispatch) => {
    dispatch(modalOpen({
      title: 'ConfirmDeviceDeleteTitle',
      body: {
        key: 'ConfirmDeviceDeleteDesc',
        value: [
          device.alias || device.name
        ]
      },
      choices: [
        {
          name: 'Yes',
          type: 'red',
          action: [goBack(), deviceDelete(device)]
        },
        {
          name: 'No'
        }
      ]
    }));
  };
}
