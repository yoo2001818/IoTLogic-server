import { toObject } from 'r6rs';

class WebRemote {
  constructor(stats, notify) {
    this.stats = stats;
    if (stats.remote == null) stats.remote = {};
    this.notify = notify;
    this.directives = {
      button: this.button.bind(this),
      text: this.text.bind(this),
      remove: this.remove.bind(this),
      listen: this.listen.bind(this)
    };
  }
  button(params) {
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
    this.stats.remote[group][name] = {
      type: 'button',
      text, extra
    };
    this.notify();
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
  text(params) {
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
    this.stats.remote[group][name] = {
      type: 'text',
      text, extra
    };
    this.notify();
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
    // TODO
  }
  disconnect() {
  }
}

export default function webRemote(device, stats, _, msgServer) {
  let deviceId = device.id;
  return new WebRemote(stats, () => msgServer.notifyDeviceUpdate(
    deviceId
  ));
}
