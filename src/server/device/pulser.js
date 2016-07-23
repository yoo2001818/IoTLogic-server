import { toObject, NUMBER } from 'r6rs';

class Pulser {
  constructor() {
    this.timers = [];
    // This must be specified - or bad thing will happen.
    this.directives = {
      timer: this.timer.bind(this)
    };
  }
  timer(params, callback) {
    let options;
    if (params.type === NUMBER) {
      options = params.value;
    } else {
      options = toObject(params)[0];
    }
    let timerId = setInterval(callback, options);
    this.timers.push(timerId);
    return () => clearInterval(timerId);
  }
  disconnect() {
    this.timers.forEach(v => clearInterval(v));
  }
}

export default function pulser(device) {
  // Simple demonstration to show how pseudodevice works.
  console.log('Pseudodevice pulser initialized');
  return new Pulser();
}
