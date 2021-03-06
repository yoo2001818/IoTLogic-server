import { DefaultResolver } from 'r6rs-async-io';
import { SYMBOL, STRING, PAIR } from 'r6rs';
import { NOOP } from 'iotlogic-core';

function checkValidity(data) {
  if (data == null ||
    (data.type !== SYMBOL && data.type !== STRING)
  ) {
    throw new Error('Data must be a string or symbol');
  }
  return data;
}

// Resolver that considers pseudodevices.
export default class ServerResolver extends DefaultResolver {
  constructor(synchronizer, directives) {
    super(directives);
    this.synchronizer = synchronizer;
  }
  resolve(keyword) {
    if (keyword == null) throw new Error('Event name cannot be null');
    let deviceName, commandName;
    if (keyword.type === PAIR) {
      // In this case, deviceName is car, and commandName is cadr.
      // other variables will be ignored, however.
      deviceName = checkValidity(keyword.car).value;
      commandName = checkValidity(keyword.cdr.car).value;
    } else if (keyword.type === SYMBOL || keyword.type === STRING) {
      // TODO We have to handle nonexistent directives, since we have to send
      // other nodes 'not exist' error.
      if (keyword.value.indexOf(':') === -1) {
        throw new Error('Device name must be specified like client:doStuff');
      }
      let pos = keyword.value.indexOf(':');
      deviceName = keyword.value.slice(0, pos);
      commandName = keyword.value.slice(pos + 1);
    } else {
      throw new Error('Event name must be a string, symbol, or pair');
    }
    if (this.synchronizer.pseudoDevices[deviceName] != null) {
      let pseudoDevice = this.synchronizer.pseudoDevices[deviceName].device;
      // TODO Is this the right place for this?
      if (commandName === 'functions') {
        return (params, callback) => {
          let arr = Object.keys(pseudoDevice.directives);
          setTimeout(() => callback([arr], true), 0);
        };
      }
      // Pass the pseudo-device's directive.
      return pseudoDevice.directives[commandName];
    }
    return NOOP;
  }
}
