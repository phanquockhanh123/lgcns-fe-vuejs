const connection = new WebSocket("ws://localhost:8081/ws");

connection.onmessage = function (event) {
  console.log(event)
  let notification = JSON.parse(event.data);

  this.notifications.push(notification);
  console.log(this.notifications)
};

connection.onopen = function (event) {
  console.log(event);
  console.log("Successfully connected to the echo websocket server...");
};