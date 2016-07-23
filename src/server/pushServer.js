import { Device, Document } from './db';

function parseJSON(string) {
  try {
    return JSON.parse(string);
  } catch (e) {
    return null;
  }
}

export default class PushServer {
  constructor() {
    this.userClients = {};
    this.deviceDatas = {};
    this.documentDatas = {};
    this.consoleTimers = {};
    this.consoleMsg = {};
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

    client.onmessage = event => {
      let data = parseJSON(event.data);
      if (data == null) return;
      switch (data.type) {
      case 'registerConsole': {
        if (client.consoles == null) client.consoles = {};
        client.consoles[data.data] = true;
        return;
      }
      case 'unregisterConsole': {
        if (client.consoles == null) client.consoles = {};
        client.consoles[data.data] = false;
        return;
      }
      }
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
  fetchDocumentData(documentId) {
    if (this.documentDatas[documentId] != null) {
      return Promise.resolve(this.documentDatas[documentId]);
    }
    return Document.findById(documentId)
    .then(document => {
      let obj = document.toJSON();
      this.documentDatas[documentId] = obj;
      return obj;
    });
  }
  fetchDeviceData(deviceId) {
    if (this.deviceDatas[deviceId] != null) {
      return Promise.resolve(this.deviceDatas[deviceId]);
    }
    return Device.findById(deviceId)
    .then(device => {
      let obj = device.toJSON();
      this.deviceDatas[deviceId] = obj;
      return obj;
    });
  }
  sendDocument(documentId, type, payload, validateUser) {
    return this.fetchDocumentData(documentId)
    .then(document => {
      let data = JSON.stringify({type: type, data: Object.assign({}, {
        id: document.id
      }, payload)});
      let userId = document.userId;
      let arr = this.userClients[userId];
      if (arr == null) return;
      arr.forEach(client => {
        if (validateUser != null) {
          if (validateUser(client)) client.send(data);
          return;
        }
        client.send(data);
      });
    }, err => {
      console.log(err);
    });
  }
  sendDevice(deviceId, type, payload) {
    return this.fetchDeviceData(deviceId)
    .then(device => {
      let data = JSON.stringify({type: type, data: Object.assign({}, {
        id: device.id,
        name: device.name
      }, payload)});
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
  pushDocumentError(documentId, error) {
    this.sendDocument(documentId, 'documentError', { error });
  }
  pushDocumentConsole(documentId, message) {
    if (this.consoleTimers[documentId] != null) {
      this.consoleMsg[documentId] += message;
      return;
    }
    this.consoleTimers[documentId] = setTimeout(() => {
      let msg = this.consoleMsg[documentId];
      this.sendDocument(documentId, 'documentConsole', { message: msg },
        client => {
          return client.consoles[documentId] === true;
        });
      delete this.consoleTimers[documentId];
      delete this.consoleMsg[documentId];
    }, 50);
    this.consoleMsg[documentId] = message;
  }
  updateDevice(deviceId) {
    let stat = this.messageServer.getDeviceStats({ id: deviceId });
    this.sendDevice(deviceId, 'device', stat)
    .then(() => {
      if (!stat.connected) delete this.deviceDatas[deviceId];
    });
  }
  updateDocument(documentId) {
    let stat = this.messageServer.getDocumentStats({ id: documentId });
    this.sendDocument(documentId, 'document', stat)
    .then(() => {
      if (!stat.running) delete this.documentDatas[documentId];
    });
  }
}
