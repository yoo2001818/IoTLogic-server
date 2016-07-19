import { createAction } from 'redux-actions';
import { arrayOf } from 'normalizr';
import { Document } from '../schema/index';
import { api, GET, POST, DELETE } from '../middleware/api';

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

// WIP
export const EVALUATE = 'document/evaluate';

export const fetchList = createAction(FETCH_LIST,
  () => api(GET, '/documents/', {}),
  () => ({
    errors: [401],
    schema: arrayOf(Document)
  }));
export const fetch = createAction(FETCH,
  id => api(GET, `/documents/${id}`, {}),
  () => ({
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
  (id, code) => api(POST, `/documents/${id}`, {
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
  (id) => api(DELETE, `/documents/${id}/workspace`, {
    plain: true
  }),
  document => ({
    relation: ['documents', document.id, 'workspace']
  }));
export function load(name) {
  return (dispatch, getState) => {
    const { entities: { documents } } = getState();
    const entry = documents[name];
    if (entry != null && entry.devices !== undefined &&
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
    const document = getState().document;
    if (document.load && document.load.loading) return Promise.resolve();
    if (!document.loaded) return dispatch(fetchList());
    return Promise.resolve();
  };
}
