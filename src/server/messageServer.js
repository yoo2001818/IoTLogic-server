import { Environment, Router } from 'iotlogic-core';
import { WebSocketServerConnector } from 'locksmith-connector-ws';

import { Device, Document } from './db';

import synchronizerConfig from '../../config/synchronizer.config.js';
import ServerResolver from './util/serverResolver';
import pseudoDevices from './device';

const debug = require('debug')('IoTLogic:messageServer');

const MAX_DEVICE_ERRORS = 10;
const MAX_DOCUMENT_ERRORS = 10;

export default class MessageServer {
  constructor(server, pushServer) {
    this.pseudoDeviceStats = {};
    this.deviceStats = {};
    this.dbClients = {};
    this.socketClients = {};
    this.pushServer = pushServer;
    this.connector = new WebSocketServerConnector(server, true);
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

      this.pushServer.updateDevice(device.id);

      // Load required documents
      device.getDocuments({
        include: [ Device ]
      })
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
          synchronizer.push({
            type: 'reset'
          });
        });
      }, error => {
        debug('Loading device documents failed');
        console.log(error);
        this.connector.error('DB Error', clientId);
      });
    });
    this.router.on('error', (name, err, clientId, fromClient) => {
      console.log((err && err.stack) || err);
      // If name is null, it's a device error. If not, it's a document error.
      debug('Handling error from ' + name);
      if (fromClient && name == null) {
        // let dataId = this.socketClients[clientId];
        let stats = this.deviceStats[clientId];
        if (stats == null) return;
        stats.errors = stats.errors.slice(0, MAX_DEVICE_ERRORS);
        stats.errors.push(err);
        this.pushServer.updateDevice(this.socketClients[clientId]);
      } else if (name != null) {
        let synchronizer = this.router.synchronizers[name];
        if (synchronizer == null) return;
        let header = '';
        if (clientId != null && clientId !== 0) {
          let client = synchronizer.clients[clientId];
          client = client && client.meta;
          header = (client && client.name) + ': ';
          if (client == null) return;
        }
        synchronizer.errors = synchronizer.errors.slice(0,
          MAX_DOCUMENT_ERRORS);
        synchronizer.errors.push(header + err);
        this.pushServer.pushDocumentError(parseInt(name.slice(3)),
          header + err);
      }
    });
    this.router.on('connect', () => {
      debug('Connected!');
    });
    this.router.on('disconnect', (name, clientId) => {
      if (name === true) {
        debug('Disconnected from ' + clientId);
        let deviceId = this.socketClients[clientId];
        delete this.deviceStats[clientId];
        delete this.dbClients[deviceId];
        delete this.socketClients[clientId];
        this.pushServer.updateDevice(deviceId);
      } else {
        // Check document's client size, then destroy it if nobody is there
        let synchronizer = this.router.synchronizers[name];
        if (synchronizer == null) return;
        synchronizer.push({
          type: 'reset'
        });
        if (synchronizer.clientList.length <= 1 &&
          Object.keys(synchronizer.pseudoDevices).length === 0
        ) {
          debug('Removing synchronizer ' + name);
          // Remove synchronizer
          for (let key in synchronizer.pseudoDevices) {
            synchronizer.pseudoDevices[key].disconnect();
          }
          synchronizer.stop();
          this.router.removeSynchronizer(name);
          this.pushServer.updateDocument(parseInt(name.slice(3)));
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

    this.connector.start(null, true);
    this.initPseudoDevices();
  }
  getDeviceStats(device) {
    if (this.pseudoDeviceStats[device.id] != null) {
      return this.pseudoDeviceStats[device.id];
    }
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
  initPseudoDevices() {
    // Start documents with pseudo device attached
    Device.findAll({
      where: {
        type: {
          $in: Object.keys(pseudoDevices)
        }
      },
      include: [{
        model: Document,
        include: [ Device ]
      }]
    })
    .then(devices => {
      devices.forEach(device => {
        device.documents.forEach(document => {
          this.createEnvironment(document, true);
        });
      });
    });
  }
  notifyDeviceUpdate(deviceId) {
    this.pushServer.updateDevice(deviceId);
  }
  createEnvironment(document, pseudoOnly = false) {
    if (document.state !== 'start') {
      debug('Ignoring stopped document ' + document.name);
      return;
    }
    let docIntId = document.id;
    let docId = 'doc' + document.id;
    let synchronizer = this.router.synchronizers[docId];
    if (synchronizer == null) {
      debug('Creating environment instance of document ' + document.name);
      // Create environment
      let resolver = new ServerResolver();
      let environment = new Environment('__server', this.router,
        synchronizerConfig, false, undefined, resolver);
      this.router.addSynchronizer(docId, environment.synchronizer);
      environment.setPayload(document.payload);
      environment.runOnStart = false;
      // Do nothing for stdout.... :/
      environment.handleReset = () => {
        this.pushServer.pushDocumentConsole(docIntId, '-- Restart --\n');
        environment.machine.stdout = msg => {
          this.pushServer.pushDocumentConsole(docIntId, msg);
        };
      };
      synchronizer = environment.synchronizer;
      resolver.synchronizer = synchronizer;
      // Synchronizer errors
      synchronizer.errors = [];
      synchronizer.pseudoDevices = {};
      synchronizer.pseudoDeviceIdRef = {};
      // Start the environment instance
      synchronizer.start();
      // Start pseudodevices
      let hasPseudo = false;
      document.devices.forEach(device => {
        if (pseudoDevices[device.type] != null) {
          if (this.pseudoDeviceStats[device.id] == null) {
            this.pseudoDeviceStats[device.id] = {};
          }
          let pseudoStats = this.pseudoDeviceStats[device.id];
          let pseudoDevice = pseudoDevices[device.type](device, pseudoStats,
            environment, this);
          synchronizer.pseudoDevices[device.name] = {
            id: device.id, device: pseudoDevice
          };
          synchronizer.pseudoDeviceIdRef[device.id] = device.name;
          environment.clientList.push(Object.assign({}, device.toJSON(), {
            pseudo: true,
            id: 'pseudo_' + device.id
          }));
          hasPseudo = true;
        }
      });
      if (hasPseudo && pseudoOnly) {
        synchronizer.push({
          type: 'reset'
        });
      }
      this.pushServer.updateDocument(document.id);
    }
    return synchronizer;
  }
  updateDevice(device) {
    debug('Handling updated device ' + device.name);
    // let data = device.toJSON();
    // Disconnect and reconnect from connected nodes
    if (pseudoDevices[device.type] != null) {
      for (let key in this.router.synchronizers) {
        let synchronizer = this.router.synchronizers[key];
        if (synchronizer.pseudoDeviceIdRef[device.id] != null) {
          let oldName = synchronizer.pseudoDeviceIdRef[device.id];
          let pseudoDevice = synchronizer.pseudoDevices[oldName];

          delete synchronizer.pseudoDevices[oldName];
          synchronizer.pseudoDevices[device.name] = pseudoDevice;
          synchronizer.pseudoDeviceIdRef[device.id] = device.name;

          // Disconnect and reconnect the node
          synchronizer.push({
            type: 'disconnect',
            data: 'pseudo_' + pseudoDevice.id
          });
          synchronizer.push({
            type: 'connect',
            data: Object.assign({}, device.toJSON(), {
              pseudo: true,
              id: 'pseudo_' + device.id
            })
          });
          synchronizer.push({
            type: 'reset'
          });
        }
      }
      return;
    }
    let clientId = this.dbClients[device.id];
    if (clientId == null) return;
    this.connector.disconnect(clientId);
    for (let key in this.router.synchronizers) {
      let synchronizer = this.router.synchronizers[key];
      if (synchronizer.clients[clientId] != null) {
        synchronizer.handleDisconnect(clientId);
        // TODO Meh. it'll reconnect anyway.
        // synchronizer.handleConnect(data, clientId);
        synchronizer.push({
          type: 'reset'
        });
      }
    }
  }
  destroyDevice(device) {
    debug('Handling destroyed device ' + device.name);
    if (pseudoDevices[device.type] != null) {
      for (let key in this.router.synchronizers) {
        let synchronizer = this.router.synchronizers[key];
        if (synchronizer.pseudoDeviceIdRef[device.id] != null) {
          let oldName = synchronizer.pseudoDeviceIdRef[device.id];
          let pseudoDevice = synchronizer.pseudoDevices[oldName];

          delete synchronizer.pseudoDevices[oldName];

          // Disconnect the node
          synchronizer.push({
            type: 'disconnect',
            data: 'pseudo_' + pseudoDevice.id
          });

          // Remove device if required
          if (synchronizer.clientList.length <= 1 &&
            Object.keys(synchronizer.pseudoDevices).length === 0
          ) {
            debug('Removing synchronizer ' + key);
            // Remove synchronizer
            synchronizer.stop();
            this.router.removeSynchronizer(key);
            this.pushServer.updateDocument(parseInt(key.slice(3)));
          }
        }
      }
      return;
    }
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
    if (!document.devices.some(device =>
      this.dbClients[device.id] != null || pseudoDevices[device.type] != null)
    ) {
      debug('All devices are not connected; ignoring');
      return;
    }
    let synchronizer = this.createEnvironment(document,
      !document.devices.some(device => this.dbClients[device.id] != null));
    document.devices.forEach(device => {
      let clientId = this.dbClients[device.id];
      if (clientId == null) return;
      if (!this.deviceStats[clientId].ready) return;
      let data = device.toJSON();
      debug('Connecting device to document ' + document.name);
      synchronizer.handleConnect(data, clientId);
    });
    synchronizer.push({
      type: 'reset'
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
    synchronizer.errors = [];
    // Update payload
    synchronizer.push({
      type: 'reset',
      data: document.payload
    });
    let environment = synchronizer.machine;
    // Update devices
    let clientIds = [];
    let deviceIds = [];
    // Handle joining
    document.devices.forEach(device => {
      if (pseudoDevices[device.type] != null) {
        deviceIds.push(device.name);
        if (synchronizer.pseudoDevices[device.name] != null) return;
        debug('Connecting pseudo device to document ' + document.name);
        // Create pseudodevice
        let pseudoDevice = pseudoDevices[device.type](device, environment);
        synchronizer.pseudoDeviceIdRef[device.id] = device.name;
        synchronizer.pseudoDevices[device.name] = {
          id: device.id, device: pseudoDevice
        };
        // Emit the connection event
        synchronizer.push({
          type: 'connect',
          data: Object.assign({}, device.toJSON(), {
            pseudo: true,
            id: 'pseudo_' + device.id
          })
        });
        return;
      }
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
    for (let key in synchronizer.pseudoDevices) {
      if (deviceIds.indexOf(key) === -1) {
        debug('Disconnecting pseudo device ' + key);
        let pseudoDevice = synchronizer.pseudoDevices[key];
        pseudoDevice.device.disconnect();
        // Emit the disconnect event
        synchronizer.push({
          type: 'disconnect',
          data: 'pseudo_' + pseudoDevice.id
        });
        delete synchronizer.pseudoDevices[key];
        delete synchronizer.pseudoDeviceIdRef[pseudoDevice.id];
      }
    }
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
    synchronizer.push({
      type: 'reset'
    });
    if (synchronizer.clientList.length <= 1 &&
      Object.keys(synchronizer.pseudoDevices).length === 0
    ) {
      debug('Removing synchronizer ' + docId);
      // Remove synchronizer
      synchronizer.stop();
      this.router.removeSynchronizer(docId);
    }
    this.pushServer.updateDocument(document.id);
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
    for (let key in synchronizer.pseudoDevices) {
      synchronizer.pseudoDevices[key].disconnect();
    }
    // Remove synchronizer
    synchronizer.stop();
    // Good bye
    this.router.removeSynchronizer(docId);
    this.pushServer.updateDocument(docId);
  }
  restartDocument(document) {
    debug('Restarting document ' + document.name);
    if (document.state !== 'start') {
      return;
    }
    let docId = 'doc' + document.id;
    let synchronizer = this.router.synchronizers[docId];
    if (synchronizer == null) {
      return;
    }
    synchronizer.errors = [];
    synchronizer.push({
      type: 'reset'
    });
  }
  evalDocument(document, code) {
    debug('Evaluating document ' + document.name);
    if (document.state !== 'start') {
      return;
    }
    let docIntId = document.id;
    let docId = 'doc' + document.id;
    let synchronizer = this.router.synchronizers[docId];
    if (synchronizer == null) {
      return;
    }
    synchronizer.push({
      type: 'eval',
      data: code
    }, true)
    .then(result => {
      let message = (result && result.inspect && result.inspect()) || result;
      this.pushServer.pushDocumentConsole(docIntId, message + '\n');
    }, error => {
      let message = error && error.message;
      synchronizer.errors = synchronizer.errors.slice(0,
        MAX_DOCUMENT_ERRORS);
      synchronizer.errors.push(message);
      this.pushServer.pushDocumentError(docIntId, message);
    });
  }
}
