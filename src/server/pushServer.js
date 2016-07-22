import { Device, Document } from './db';

export default class PushServer {
  constructor() {
    this.userClients = {};
    this.messageServer = null;
  }
  handleConnect(client) {
    let user = client.upgradeReq.user;
    if (user === null) {
      client.close();
    }
    let userId = user.id;
    if (this.userClients[userId] == null) {
      this.userClients[userId] = [];
    }
    this.userClients[userId].push(client);

    client.onmessage = () => {
      // Upstream message is not implemented anyway....
    };
    client.onerror = event => {
      console.log(event);
    };
    client.onclose = () => {
      this.handleDisconnect(client, userId);
    };
  }
  handleDisconnect(client, userId) {
    let arr = this.userClients[userId];
    if (arr == null) return;
    let index = arr.indexOf(client);
    if (index !== -1) arr.splice(index, 1);
    if (arr.length === 0) delete this.userClients[userId];
    // Well, there's nothing much to do.
  }
  updateDevice(deviceId) {
    let stat = this.messageServer.getDeviceStats({ id: deviceId });
    Device.findById(deviceId)
    .then(device => {
      let data = JSON.stringify({type: 'device', data: Object.assign({}, {
        id: device.id,
        name: device.name
      }, stat)});
      let userId = device.userId;
      let arr = this.userClients[userId];
      if (arr == null) return;
      arr.forEach(client => {
        client.send(data);
      });
    }, err => {
      console.log(err);
    });
  }
  updateDocument(documentId) {
    let stat = this.messageServer.getDocumentStats({ id: documentId });
    Document.findById(documentId)
    .then(document => {
      let data = JSON.stringify({type: 'document', data: Object.assign({}, {
        id: document.id
      }, stat)});
      let userId = document.userId;
      let arr = this.userClients[userId];
      if (arr == null) return;
      arr.forEach(client => {
        client.send(data);
      });
    }, err => {
      console.log(err);
    });
  }
}
