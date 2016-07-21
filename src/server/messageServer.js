import { Environment, Router } from 'iotlogic-core';
import { WebSocketServerConnector } from 'locksmith-connector-ws';

import { Device } from './db';
import synchronizerConfig from '../../config/synchronizer.config.js';

const debug = require('debug')('IoTLogic:messageServer');

export default class MessageServer {
  constructor(server) {
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

      if (provided && provided.initialized === false) {
        // Wait for dependency installation
        this.router.connector.connect({
          global: true, data
        }, clientId);
        return;
      }

      console.log(data);
      // TODO We should push notification to web clients
      // Also, multiprocess load-balancing would require Redis or something
      // to share the socket status (This is same for the messaging server!)

      // TODO Refactor this client table?
      this.dbClients[data.id] = clientId;
      this.socketClients[clientId] = data.id;

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
            // Start the environment instance
            synchronizer.start();
          }
          debug('Connecting device to document ' + document.name);
          synchronizer.handleConnect(data, clientId);
        });
      }, error => {
        debug('Loading device documents failed');
        console.log(error);
        this.connector.error('DB Error', clientId);
      });
    });
    this.router.on('error', err => {
      console.log((err && err.stack) || err);
    });
    this.router.on('connect', () => {
      console.log('Connected!');
    });
    this.router.on('disconnect', (name, clientId) => {
      if (name === true) {
        debug('Disconnected from ' + clientId);
        let deviceId = this.socketClients[clientId];
        // TODO Push notification
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
      console.log('Disconnected!');
    });
    this.router.on('freeze', () => {
      console.log('Synchronizer frozen');
    });
    this.router.on('unfreeze', () => {
      console.log('Synchronizer unfrozen');
    });

    this.connector.start();
  }
  updateDevice(device) {
    debug('Handling updated device ' + device.name);
    let data = device.toJSON();
    // Disconnect and reconnect from connected nodes
    let clientId = this.dbClients[device.id];
    if (clientId == null) return;
    for (let key in this.router.synchronizers) {
      let synchronizer = this.router.synchronizers[key];
      if (synchronizer.clients[clientId] != null) {
        // TODO Send disconnect
        synchronizer.handleDisconnect(clientId);
        synchronizer.handleConnect(data, clientId);
      }
    }
  }
  destroyDevice(device) {
    debug('Handling destroyed device ' + device.name);
    let clientId = this.dbClients[device.id];
    if (clientId == null) return;
    // Disconnect from main
    this.connector.disconnect(clientId);
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
    let docId = 'doc' + document.id;
    debug('Creating environment instance of document ' + document.name);
    // Create environment
    let environment = new Environment('__server', this.router,
      synchronizerConfig, true);
    this.router.addSynchronizer(docId, environment.synchronizer);
    environment.setPayload(document.payload);
    let synchronizer = environment.synchronizer;
    // Start the environment instance
    synchronizer.start();
    document.devices.forEach(device => {
      let clientId = this.dbClients[device.id];
      if (clientId == null) return;
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
        // TODO Send disconnect
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
        // TODO Send disconnect
        synchronizer.handleDisconnect(client.id);
      }
    });
    // Remove synchronizer
    synchronizer.stop();
    // Good bye
    this.router.removeSynchronizer(docId);
  }
}
