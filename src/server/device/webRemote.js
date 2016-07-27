import { toObject } from 'r6rs';
import EventEmitter from 'events';

let registry = {};

export function trigger(id, group, name) {
  if (registry[id] == null) return;
  registry[id].forEach(remote => {
    remote.handleEvent(group, name);
  });
}

class WebRemote extends EventEmitter {
  constructor(deviceId, stats, notify) {
    super();
    this.deviceId = deviceId;
    this.stats = stats;
    if (stats.remote == null) stats.remote = {};
    this.notify = notify;
    this.directives = {
      button: this.button.bind(this),
      text: this.text.bind(this),
      remove: this.remove.bind(this),
      listen: this.listen.bind(this)
    };
    if (registry[deviceId] == null) {
      registry[deviceId] = [];
    }
    registry[deviceId].push(this);
    this.listeners = {};
  }
  button(params, callback) {
    let args = toObject(params);
    if (!Array.isArray(args)) {
      throw new Error('Arguments must be a list');
    }
    if (args.length < 3) {
      throw new Error('group, name, text must be specified');
    }
    let [group, name, text, extra] = args;
    if (this.stats.remote[group] == null) {
      this.stats.remote[group] = {};
    }
    let creator = this.stats.remote[group][name] == null;
    this.stats.remote[group][name] = {
      type: 'button',
      text, extra
    };
    this.notify();
    if (!creator) {
      setTimeout(() => callback([], true), 0);
      return;
    }
    return () => {
      if (this.stats.remote[group] != null) {
        delete this.stats.remote[group][name];
        if (Object.keys(this.stats.remote[group]).length === 0) {
          delete this.stats.remote[group];
        }
        this.notify();
      }
    };
  }
  text(params, callback) {
    let args = toObject(params);
    if (!Array.isArray(args)) {
      throw new Error('Arguments must be a list');
    }
    if (args.length < 3) {
      throw new Error('group, name, text must be specified');
    }
    let [group, name, text, extra] = args;
    if (this.stats.remote[group] == null) {
      this.stats.remote[group] = {};
    }
    let creator = this.stats.remote[group][name] == null;
    this.stats.remote[group][name] = {
      type: 'text',
      text, extra
    };
    this.notify();
    if (!creator) {
      setTimeout(() => callback([], true), 0);
      return;
    }
    return () => {
      if (this.stats.remote[group] != null) {
        delete this.stats.remote[group][name];
        if (Object.keys(this.stats.remote[group]).length === 0) {
          delete this.stats.remote[group];
        }
        this.notify();
      }
    };
  }
  remove(params, callback) {
    let args = toObject(params);
    if (!Array.isArray(args)) {
      throw new Error('Arguments must be a list');
    }
    if (args.length < 2) {
      throw new Error('group, name must be specified');
    }
    let [group, name] = args;
    if (this.stats.remote[group] != null) {
      delete this.stats.remote[group][name];
      if (Object.keys(this.stats.remote[group]).length === 0) {
        delete this.stats.remote[group];
      }
      this.notify();
    }
    setTimeout(() => callback([], true), 0);
  }
  listen(params, callback) {
    let args = toObject(params);
    if (!Array.isArray(args)) {
      throw new Error('Arguments must be a list');
    }
    if (args.length < 2) {
      throw new Error('group, name must be specified');
    }
    let [group, name] = args;
    let eventListener = () => callback([]);
    this.on(group + '----' + name, eventListener);
    return () => {
      this.removeListener(group + '----' + name, eventListener);
    };
  }
  handleEvent(group, name) {
    this.emit(group + '----' + name);
  }
  disconnect() {
    if (registry[this.deviceId] == null) return;
    let index = registry[this.deviceId].indexOf(this);
    if (index === -1) return;
    registry[this.deviceId].splice(index, 1);
    if (registry[this.deviceId].length === 0) {
      delete registry[this.deviceId];
    }
  }
}

export default function webRemote(device, stats, _, msgServer) {
  let deviceId = device.id;
  return new WebRemote(deviceId, stats, () => msgServer.notifyDeviceUpdate(
    deviceId
  ));
}
