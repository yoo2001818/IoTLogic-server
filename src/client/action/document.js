import { createAction } from 'redux-actions';
import { arrayOf } from 'normalizr';
import { Document } from '../schema/index';
import { api, GET, POST, DELETE } from '../middleware/api';
import { goBack } from 'react-router-redux';
import { open as modalOpen } from './modal';

export const FETCH_LIST = 'document/fetchList';
export const FETCH = 'document/fetch';
export const CREATE = 'document/create';
export const DOCUMENT_DELETE = 'document/delete';
export const UPDATE = 'document/update';

export const FETCH_PAYLOAD = 'document/fetchPayload';
export const UPDATE_PAYLOAD = 'document/updatePayload';
export const FETCH_WORKSPACE = 'document/fetchWorkspace';
export const UPDATE_WORKSPACE = 'document/updateWorkspace';
export const DELETE_WORKSPACE = 'document/deleteWorkspace';

export const RESTART = 'document/restart';
export const EVALUATE = 'document/evaluate';
export const CLEAR_LOG = 'document/clearLog';

export const fetchList = createAction(FETCH_LIST,
  () => api(GET, '/documents/', {}),
  () => ({
    errors: [401],
    schema: arrayOf(Document)
  }));
export const fetch = createAction(FETCH,
  id => api(GET, `/documents/${id}`, {}),
  id => ({
    replace: {
      documents: {
        [id]: null
      }
    },
    errors: [401, 404],
    schema: Document
  }));
export const create = createAction(CREATE,
  document => api(POST, '/documents/', {
    body: document
  }),
  () => ({
    schema: Document
  }));
export const documentDelete = createAction(DOCUMENT_DELETE,
  document => api(DELETE, `/documents/${document.id}`, {}),
  () => ({
    schema: Document
  }));
export const update = createAction(UPDATE,
  (id, document) => api(POST, `/documents/${id}`, {
    body: document
  }),
  () => ({
    schema: Document
  }));

export const fetchPayload = createAction(FETCH_PAYLOAD,
  document => api(GET, `/documents/${document.id}/payload`, {
    plain: true
  }),
  document => ({
    relation: ['documents', document.id, 'payload']
  }));
export const updatePayload = createAction(UPDATE_PAYLOAD,
  (id, code) => api(POST, `/documents/${id}/payload`, {
    body: {
      payload: code
    },
    plain: true
  }),
  id => ({
    relation: ['documents', id, 'payload']
  }));

export const fetchWorkspace = createAction(FETCH_WORKSPACE,
  document => api(GET, `/documents/${document.id}/workspace`, {
    plain: true
  }),
  document => ({
    relation: ['documents', document.id, 'workspace']
  }));
export const updateWorkspace = createAction(UPDATE_WORKSPACE,
  (id, code) => api(POST, `/documents/${id}/workspace`, {
    body: {
      payload: code
    }
  }),
  (id, code) => ({
    append: {
      documents: {
        [id]: {
          workspace: code
        }
      }
    },
    schema: Document
  }));
export const deleteWorkspace = createAction(DELETE_WORKSPACE,
  document => api(DELETE, `/documents/${document.id}/workspace`, {
    plain: true
  }),
  document => ({
    relation: ['documents', document.id, 'workspace']
  }));
export const restart = createAction(RESTART,
  document => api(POST, `/documents/${document.id}/restart`, {}));
export const evaluate = createAction(EVALUATE,
  (document, code) => api(POST, `/documents/${document.id}/eval`, {
    body: { payload: code }
  }));
export const clearLog = createAction(CLEAR_LOG,
  () => ({}),
  document => ({
    append: {
      documents: {
        [document.id]: {
          console: ''
        }
      }
    }
  }));
export function load(name) {
  return (dispatch, getState) => {
    const { entities: { documents } } = getState();
    const entry = documents[name];
    if (entry != null && entry.devices !== undefined) {
      return Promise.resolve();
    }
    return dispatch(fetch(name));
  };
}
export function loadList() {
  return (dispatch, getState) => {
    const document = getState().document;
    if (document.load && document.load.loading) return Promise.resolve();
    if (!document.loaded) return dispatch(fetchList());
    return Promise.resolve();
  };
}
export function loadWorkspace(id) {
  return (dispatch, getState) => {
    const { entities: { documents } } = getState();
    const entry = documents[id];
    if (entry != null && entry.workspace !== undefined) {
      return Promise.resolve();
    }
    return dispatch(fetchWorkspace({id}));
  };
}

export function confirmDocumentDelete(document) {
  return (dispatch) => {
    dispatch(modalOpen({
      title: 'ConfirmDocumentDeleteTitle',
      body: {
        key: 'ConfirmDocumentDeleteDesc',
        value: [
          document.name
        ]
      },
      choices: [
        {
          name: 'Yes',
          type: 'red',
          action: [goBack(), documentDelete(document)]
        },
        {
          name: 'No'
        }
      ]
    }));
  };
}

export function confirmDeleteWorkspace(document) {
  return (dispatch) => {
    dispatch(modalOpen({
      title: 'ConfirmDeleteWorkspaceTitle',
      body: {
        key: 'ConfirmDeleteWorkspaceDesc',
        value: [
          document.name
        ]
      },
      choices: [
        {
          name: 'Yes',
          type: 'orange',
          action: [deleteWorkspace(document)]
        },
        {
          name: 'No'
        }
      ]
    }));
  };
}

export function confirmUpdatePayload(document, code) {
  return (dispatch) => {
    dispatch(modalOpen({
      title: 'ConfirmUpdatePayloadTitle',
      body: {
        key: 'ConfirmUpdatePayloadDesc',
        value: [
          document.name
        ]
      },
      choices: [
        {
          name: 'Yes',
          type: 'green',
          action: [updatePayload(document.id, code)]
        },
        {
          name: 'No'
        }
      ]
    }));
  };
}
