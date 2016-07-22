import { Environment, Router } from 'iotlogic-core';
import { WebSocketServerConnector } from 'locksmith-connector-ws';

import { Device } from './db';
import synchronizerConfig from '../../config/synchronizer.config.js';

const debug = require('debug')('IoTLogic:messageServer');

const MAX_DEVICE_ERRORS = 10;
const MAX_DOCUMENT_ERRORS = 10;

export default class MessageServer {
  constructor(server) {
    this.deviceStats = {};
    this.dbClients = {};
    this.socketClients = {};
    this.connector = new WebSocketServerConnector({
      server,
      verifyClient: (info, cb) => {
        let token = info.req.url.slice(1);
        // TODO server -> client push notification (with websocket)
        debug('A client connected with token ' + token);
        Device.findOne({ where: { token } })
        .then(device => {
          if (device == null) {
            debug('Unknown token (Unauthorized)');
            cb(false, 401, 'Unauthorized');
            return;
          }
          info.req.device = device;
          cb(true);
        }, error => {
          debug('Token loading failed');
          console.log(error);
          cb(false, 500, 'Internal server error');
        });
      }
    });
    this.router = new Router(this.connector, true, (provided, clientId) => {
      debug('Connection established with ' + clientId);
      // Ignore data from the client; We've already loaded device info
      let device = this.connector.clients[clientId].upgradeReq.device;
      let data = device.toJSON();

      // Duplicate client instance is not allowed; try to disconnect the other
      // if possible.
      if (this.dbClients[data.id] != null) {
        let oldId = this.dbClients[data.id];
        if (oldId !== clientId) {
          this.connector.disconnect(oldId);
          this.router.handleDisconnect(oldId);
        }
      }

      // TODO We should push notification to web clients
      // Also, multiprocess load-balancing would require Redis or something
      // to share the socket status (This is same for the messaging server!)

      // TODO Refactor this client table?
      this.deviceStats[clientId] = {
        errors: [],
        ready: false
      };
      this.dbClients[data.id] = clientId;
      this.socketClients[clientId] = data.id;

      if (provided && provided.initialized === false) {
        // Wait for dependency installation
        this.router.connector.connect({
          global: true, data
        }, clientId);
        return;
      }

      this.deviceStats[clientId].ready = true;

      // Load required documents
      device.getDocuments()
      .then(documents => {
        debug('Loaded device documents');
        // Create document
        documents.forEach(document => {
          // Ignore stopped documents
          if (document.state !== 'start') {
            debug('Ignoring stopped document ' + document.name);
            return;
          }
          // Numbers create some issues
          debug('Connecting device to document ' + document.name);
          let synchronizer = this.createEnvironment(document);
          synchronizer.handleConnect(data, clientId);
        });
      }, error => {
        debug('Loading device documents failed');
        console.log(error);
        this.connector.error('DB Error', clientId);
      });
    });
    this.router.on('error', (name, err, clientId, fromClient) => {
      console.log((err && err.stack) || err);
      if (fromClient) {
        // If name is null, it's a device error. If not, it's a document error.
        debug('Handling error from ' + name);
        if (name == null) {
          // let dataId = this.socketClients[clientId];
          let stats = this.deviceStats[clientId];
          if (stats == null) return;
          stats.errors = stats.errors.slice(0, MAX_DEVICE_ERRORS);
          stats.errors.push(err);
          // TODO Push notification
        } else {
          let synchronizer = this.router.synchronizers[name];
          if (synchronizer == null) return;
          let client = synchronizer.clients[clientId];
          client = client && client.meta;
          synchronizer.errors = synchronizer.errors.slice(0,
            MAX_DOCUMENT_ERRORS);
          synchronizer.errors.push((client && client.name) + ': ' + err);
          // TODO Push notification
        }
      }
    });
    this.router.on('connect', () => {
      debug('Connected!');
    });
    this.router.on('disconnect', (name, clientId) => {
      if (name === true) {
        debug('Disconnected from ' + clientId);
        let deviceId = this.socketClients[clientId];
        // TODO Push notification
        delete this.deviceStats[clientId];
        delete this.dbClients[deviceId];
        delete this.socketClients[clientId];
      } else {
        // Check document's client size, then destroy it if nobody is there
        let synchronizer = this.router.synchronizers[name];
        if (synchronizer == null) return;
        if (synchronizer.clientList.length <= 1) {
          debug('Removing synchronizer ' + name);
          // Remove synchronizer
          synchronizer.stop();
          this.router.removeSynchronizer(name);
        }
      }
      debug('Disconnected!');
    });
    this.router.on('freeze', () => {
      debug('Synchronizer frozen');
    });
    this.router.on('unfreeze', () => {
      debug('Synchronizer unfrozen');
    });

    this.connector.start();
  }
  getDeviceStats(device) {
    let clientId = this.dbClients[device.id];
    if (clientId == null) {
      return {
        connected: false
      };
    }
    let deviceStats = this.deviceStats[clientId];
    return Object.assign({}, deviceStats, {
      connected: true
    });
  }
  getDocumentStats(document) {
    let docId = 'doc' + document.id;
    let synchronizer = this.router.synchronizers[docId];
    if (synchronizer == null) {
      return {
        running: false
      };
    }
    return {
      running: true,
      errors: synchronizer.errors
    };
  }
  createEnvironment(document) {
    if (document.state !== 'start') {
      debug('Ignoring stopped document ' + document.name);
      return;
    }
    let docId = 'doc' + document.id;
    let synchronizer = this.router.synchronizers[docId];
    if (synchronizer == null) {
      debug('Creating environment instance of document ' + document.name);
      // Create environment
      let environment = new Environment('__server', this.router,
        synchronizerConfig, true);
      this.router.addSynchronizer(docId, environment.synchronizer);
      environment.setPayload(document.payload);
      synchronizer = environment.synchronizer;
      // Synchronizer errors
      synchronizer.errors = [];
      // Start the environment instance
      synchronizer.start();
    }
    return synchronizer;
  }
  updateDevice(device) {
    debug('Handling updated device ' + device.name);
    // let data = device.toJSON();
    // Disconnect and reconnect from connected nodes
    let clientId = this.dbClients[device.id];
    if (clientId == null) return;
    this.connector.disconnect(clientId);
    for (let key in this.router.synchronizers) {
      let synchronizer = this.router.synchronizers[key];
      if (synchronizer.clients[clientId] != null) {
        synchronizer.handleDisconnect(clientId);
        // TODO Meh. it'll reconnect anyway.
        // synchronizer.handleConnect(data, clientId);
      }
    }
  }
  destroyDevice(device) {
    debug('Handling destroyed device ' + device.name);
    let clientId = this.dbClients[device.id];
    if (clientId == null) return;
    // Disconnect from main
    this.connector.disconnect(clientId);
    this.router.handleDisconnect(clientId);
  }
  addDocument(document) {
    debug('Handling added document ' + document.name);
    if (document.devices == null) {
      throw new Error('Devices value must be present (Eager loading)');
    }
    if (document.state !== 'start') {
      debug('Ignoring stopped document ' + document.name);
      return;
    }
    if (!document.devices.some(device => this.dbClients[device.id] != null)) {
      debug('All devices are not connected; ignoring');
      return;
    }
    let synchronizer = this.createEnvironment(document);
    document.devices.forEach(device => {
      let clientId = this.dbClients[device.id];
      if (clientId == null) return;
      if (!this.deviceStats[clientId].ready) return;
      let data = device.toJSON();
      debug('Connecting device to document ' + document.name);
      synchronizer.handleConnect(data, clientId);
    });
  }
  updateDocument(document) {
    debug('Handling updated document ' + document.name);
    if (document.devices == null) {
      throw new Error('Devices value must be present (Eager loading)');
    }
    if (document.state !== 'start') {
      return this.destroyDocument(document);
    }
    let docId = 'doc' + document.id;
    // Is the node missing from documents table?
    let synchronizer = this.router.synchronizers[docId];
    if (synchronizer == null) {
      return this.addDocument(document);
    }
    // Update payload
    synchronizer.push({
      type: 'reset',
      data: document.payload
    });
    // Update devices
    let clientIds = [];
    // Handle joining
    document.devices.forEach(device => {
      let clientId = this.dbClients[device.id];
      if (clientId == null) return;
      if (!this.deviceStats[clientId].ready) return;
      clientIds.push(clientId);
      if (synchronizer.clients[clientId] == null) {
        let data = device.toJSON();
        debug('Connecting device to document ' + document.name);
        synchronizer.handleConnect(data, clientId);
      }
    });
    // Handle disconnecting
    synchronizer.clientList.forEach(client => {
      if (client.id !== this.connector.getClientId() &&
        clientIds.indexOf(client.id) === -1
      ) {
        // Disconnect node
        debug('Disconnecting client ' + client.id);
        this.connector.push({
          name: docId, disconnect: true
        }, client.id);
        synchronizer.handleDisconnect(client.id);
      }
    });
  }
  destroyDocument(document) {
    debug('Handling destroyed document ' + document.name);
    let docId = 'doc' + document.id;
    let synchronizer = this.router.synchronizers[docId];
    if (synchronizer == null) return;
    synchronizer.clientList.forEach(client => {
      if (client.id !== this.connector.getClientId()) {
        // Disconnect node
        debug('Disconnecting client ' + client.id);
        this.connector.push({
          name: docId, disconnect: true
        }, client.id);
        synchronizer.handleDisconnect(client.id);
      }
    });
    // Remove synchronizer
    synchronizer.stop();
    // Good bye
    this.router.removeSynchronizer(docId);
  }
}
