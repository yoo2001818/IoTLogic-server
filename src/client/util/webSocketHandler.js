export default function webSocketHandler(client, store) {
  client.onopen = () => {
    console.log('open');
  };
  client.onmessage = event => {
    console.log('message', event);
  };
  client.onerror = event => {
    console.log('error', event);
  };
  client.onclose = event => {
    console.log('closed', event);
  };
}
