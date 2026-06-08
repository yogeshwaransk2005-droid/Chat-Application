import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

let messageCallback = null;
let typingCallback = null;

export const connectSocket = (
  token,
  onMessageReceived,
  onTypingReceived
) => {

  if (stompClient?.connected) {
    console.log("Already Connected");
    return;
  }

  messageCallback = onMessageReceived;
  typingCallback = onTypingReceived;

  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS("https://chat-application-gmdg.onrender.com/chat"),

    reconnectDelay: 5000,

    debug: (msg) => {
      console.log("STOMP:", msg);
    },

    onConnect: () => {

      console.log("✅ Connected");

      stompClient.subscribe(
        "/topic/messages",
        (message) => {

          const data =
            JSON.parse(message.body);

          console.log(
            "📩 Message Received",
            data
          );

          if (messageCallback) {
            messageCallback(data);
          }
        }
      );

      stompClient.subscribe(
        "/topic/typing",
        (message) => {

          const data =
            JSON.parse(message.body);

          if (typingCallback) {
            typingCallback(data);
          }
        }
      );
    },

    onStompError: (frame) => {
      console.error(
        "STOMP ERROR",
        frame
      );
    },

    onWebSocketClose: () => {
      console.log(
        "❌ WebSocket Closed"
      );
    },

    onWebSocketError: (err) => {
      console.error(
        "❌ WebSocket Error",
        err
      );
    }
  });

  stompClient.activate();
};

export const sendSocketMessage = (
  payload
) => {

  console.log(
    "Sending",
    payload
  );

  if (!stompClient?.connected) {

    console.error(
      "❌ Socket Not Connected"
    );

    return;
  }

  stompClient.publish({
    destination: "/app/message",
    body: JSON.stringify(payload)
  });

  console.log(
    "✅ Message Sent"
  );
};

export const sendTypingEvent = (
  payload
) => {

  if (!stompClient?.connected) {
    return;
  }

  stompClient.publish({
    destination: "/app/message",
    body: JSON.stringify({
      ...payload,
      type: "typing"
    })
  });
};

export const disconnectSocket = () => {

  if (stompClient) {

    stompClient.deactivate();

    stompClient = null;

    console.log(
      "❌ Socket Disconnected"
    );
  }
};

export const isSocketConnected =
  () => stompClient?.connected || false;