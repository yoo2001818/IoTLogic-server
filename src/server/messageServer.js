import { Environment, Router } from 'iotlogic-core';
import { WebSocketServerConnector } from 'locksmith-connector-ws';

export default class MessageServer {
  constructor(server) {
    this.connector = new WebSocketServerConnector({
      server,
      verifyClient: (info, cb) => {
        console.log(info);
        cb(true);
      }
    });
    this.router = new Router(this.connector, true);
    this.router.on('error', err => {
      console.log((err && err.stack) || err);
    });
    this.router.on('connect', () => {
      console.log('Connected!');
    });
    this.router.on('disconnect', () => {
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
