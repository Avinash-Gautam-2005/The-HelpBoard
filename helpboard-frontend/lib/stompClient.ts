import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function createStompClient(token: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const client = new Client({
    webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
    connectHeaders: {
      Authorization: token?.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`,
    },
    debug: (str) => console.log("[STOMP]", str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });
  if (typeof window !== "undefined") {
    window.stompClient = client;
  }
  return client;
}