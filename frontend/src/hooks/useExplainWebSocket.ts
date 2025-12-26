import { useCallback, useEffect, useRef, useState } from "react";

export function useExplainWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(url);
    wsRef.current = socket;
    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = event.data;
       
        if (!data || typeof data !== "string") {
          return;
        }

       
        if (!data.startsWith("{") && !data.startsWith("[")) {
          //console.log("Received plain text message:", data);
          return;
        }
        const msg: ServerMessage = JSON.parse(data);
      
        setMessages((prev) => {

          if (msg.type ==="meta" && msg.message.includes("complete")) return [prev[prev.length -1], msg]

          return [...prev, msg]
        });
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };
  }, [url]);

  const sendMessage = useCallback((msg: ClientMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
      console.log("hey")
    } else {
      console.warn("WebSocket not connected");
    }
  }, []);

  return { messages, sendMessage, connected };
}
