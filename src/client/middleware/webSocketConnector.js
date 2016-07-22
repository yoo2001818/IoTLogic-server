export default function webSocketConnector(address, addHandler) {
  let webSocketClient = null;
  return store => next => action => {
    let prevState = store.getState();
    let result = next(action);
    let currentState = store.getState();
    if (currentState.user.username != null && (!prevState.user ||
      prevState.user.username == null) && webSocketClient == null
    ) {
      webSocketClient = new WebSocket(address);
      addHandler(webSocketClient);
    }
    if (currentState.user.username == null && prevState.user &&
      prevState.user.username != null && webSocketClient != null
    ) {
      webSocketClient.close();
      webSocketClient = null;
    }
    return result;
  };
}
