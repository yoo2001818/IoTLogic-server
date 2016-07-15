import { Environment, Router } from 'iotlogic-core';
import { WebSocketServerConnector } from 'locksmith-connector-ws';

import { Device } from './db';

export default class MessageServer {
  constructor(server) {
    this.dbClients = {};
    this.socketClients = {};
    this.connector = new WebSocketServerConnector({
      server,
      verifyClient: (info, cb) => {
        let token = info.req.url.slice(1);
        // TODO server -> client push notification (with websocket)
        Device.findOne({ where: { token } })
        .then(device => {
          if (device == null) {
            cb(false, 401, 'Unauthorized');
            return;
          }
          info.req.device = device;
          cb(true);
        }, error => {
          console.log(error);
          cb(false, 500, 'Internal server error');
        });
      }
    });
    this.router = new Router(this.connector, true, (_, clientId) => {
      // Ignore data from the client; We've already loaded device info
      let data = this.connector.clients[clientId].upgradeReq.device.toJSON();
      console.log(data);
      // TODO We should push notification to web clients
      // Also, multiprocess load-balancing would require Redis or something
      // to share the socket status (This is same for the messaging server!)

      // TODO Refactor this client table?
      this.dbClients[data.id] = clientId;
      this.socketClients[clientId] = data.id;
      // :P
      for (let key in this.router.synchronizers) {
        this.router.synchronizers[key].handleConnect(data, clientId);
      }
    });
    this.router.on('error', err => {
      console.log((err && err.stack) || err);
    });
    this.router.on('connect', () => {
      console.log('Connected!');
    });
    this.router.on('disconnect', (name, clientId) => {
      if (name === true) {
        let deviceId = this.socketClients[clientId];
        // TODO Push notification
        delete this.dbClients[deviceId];
        delete this.socketClients[clientId];
      }
      console.log('Disconnected!');
    });
    this.router.on('freeze', () => {
      console.log('Synchronizer frozen');
    });
    this.router.on('unfreeze', () => {
      console.log('Synchronizer unfrozen');
    });

    // Hard coded router for testing
    let environment = new Environment('server', this.router, {
      dynamic: true,
      dynamicPushWait: 10,
      dynamicTickWait: 10,
      fixedTick: 50,
      fixedBuffer: 0,
      disconnectWait: 10000,
      freezeWait: 1000
    });

    this.router.addSynchronizer('main', environment.synchronizer);

    this.connector.start();
  }
}
