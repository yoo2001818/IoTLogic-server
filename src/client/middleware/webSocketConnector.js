import ReconnectingWebSocket from 'reconnectingwebsocket';
import * as ConsoleActions from '../action/console';

const PUSH = 'notification/push';

function parseJSON(string) {
  try {
    return JSON.parse(string);
  } catch (e) {
    return null;
  }
}

export default function webSocketConnector(address) {
  let client = null;
  let sendBuffer = [];
  return store => {
    function handleCreate() {
      client.onopen = () => {
        console.log('Connected to the push notification server.');
        while (sendBuffer.length > 0) {
          sendData(sendBuffer.shift());
        }
      };
      client.onmessage = event => {
        let data = parseJSON(event.data);
        if (data == null) return;
        console.log('Push notification received');
        switch (data.type) {
        case 'document':
          // I'm not sure if this is okay....
          return store.dispatch({
            type: PUSH,
            payload: {
              entities: {
                documents: {
                  [data.data.id]: data.data
                }
              },
              result: data.data.id
            }
          });
        case 'documentConsole': {
          let documentStat = store.getState().entities.documents[data.data.id];
          if (documentStat == null) return;
          return store.dispatch({
            type: PUSH,
            payload: {
              entities: {
                documents: {
                  [data.data.id]: {
                    console: (documentStat.console || '') + data.data.message
                  }
                }
              },
              result: data.data.id
            }
          });
        }
        case 'documentError': {
          let documentStat = store.getState().entities.documents[data.data.id];
          if (documentStat == null) return;
          return store.dispatch({
            type: PUSH,
            payload: {
              entities: {
                documents: {
                  [data.data.id]: {
                    errors: (documentStat.errors || []).slice(0, 10)
                      .concat(data.data.error)
                  }
                }
              },
              result: data.data.id
            }
          });
        }
        case 'device':
          return store.dispatch({
            type: PUSH,
            payload: {
              entities: {
                devices: {
                  [data.data.name]: data.data
                }
              },
              result: data.data.name
            }
          });
        }
      };
      client.onerror = event => {
        console.log('error', event);
      };
      client.onclose = () => {
        console.log('Disconnected from the push notification server.');
      };
    }
    function sendData(data, drop = false) {
      if (client != null && client.readyState === 1) {
        client.send(JSON.stringify(data));
      } else if (!drop) {
        sendBuffer.push(data);
      }
    }
    return next => action => {
      let prevState = store.getState();
      let result = next(action);
      let currentState = store.getState();
      if (currentState.user.username != null && (!prevState.user ||
        prevState.user.username == null) && client == null
      ) {
        client = new ReconnectingWebSocket(address);
        handleCreate();
      }
      if (currentState.user.username == null && prevState.user &&
        prevState.user.username != null && client != null
      ) {
        client.close();
        client = null;
      }
      if (action.type === ConsoleActions.REGISTER) {
        sendData({
          type: 'registerConsole',
          data: action.payload
        });
      }
      if (action.type === ConsoleActions.UNREGISTER) {
        sendData({
          type: 'unregisterConsole',
          data: action.payload
        });
      }
      return result;
    };
  };
}
