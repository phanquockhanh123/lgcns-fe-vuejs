import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

var stompClient = null;

var handlers = [];

export function connect() {
  const socket = new SockJS("http://localhost:8081/ws");

  stompClient = Stomp.over(socket);

  stompClient.connect(
    {},
    (frame) => {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/books", (message) => {
        console.log(123);
      });
    },
    (error) => {
      console.log(error);
    }
  );
}

export function addHandler(handler) {
  handlers.push(handler)
}

export function disconnect() {
  if (stompClient !== null) {
      stompClient.disconnect()
  }
  console.log("Disconnected")
}

export function sendMessage(message) {
  stompClient.send("/app/books", {}, JSON.stringify(message))
}
