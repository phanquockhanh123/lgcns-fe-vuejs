import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

var stompClient = null;

export function connect() {
  const socket = new SockJS("http://localhost:8081/ws");

  stompClient = Stomp.over(socket);

  stompClient.connect(
    {},
    (frame) => {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/book", (message) => {
        console.log(123);
      });
    },
    (error) => {
      console.log(error);
    }
  );
}

export function disconnect() {
    if (stompClient !== null){
        stompClient.disconnect();
    }
    console.log("Disconnected");
}
