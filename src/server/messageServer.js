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
    this.router = new Router(this.connector, true, (_, clientId) => {
      debug('Connection established with ' + clientId);
      // Ignore data from the client; We've already loaded device info
      let device = this.connector.clients[clientId].upgradeReq.device;
      let data = device.toJSON();
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
        // TODO Remove documents
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
}
