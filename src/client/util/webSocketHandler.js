function parseJSON(string) {
  try {
    return JSON.parse(string);
  } catch (e) {
    return null;
  }
}

const PUSH = 'notification/push';

export default function webSocketHandler(client, store) {
  client.onopen = () => {
    console.log('Connected to the push notification server.');
  };
  client.onmessage = event => {
    let data = parseJSON(event.data);
    if (data == null) return;
    console.log('Push notification received');
    if (data.type === 'document') {
      // I'm not sure if this is okay....
      store.dispatch({
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
    } else if (data.type === 'device') {
      store.dispatch({
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
