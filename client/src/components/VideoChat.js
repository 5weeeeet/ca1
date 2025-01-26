import { useEffect, useState } from 'react';

const useWebSocketWithReconnect = (url, reconnectInterval = 5000, handlers = {}) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let ws;
    let timeout;

    const connect = () => {
      ws = new WebSocket(url);
      setSocket(ws);

      ws.onopen = () => {
        console.log('WebSocket connection established');
        clearTimeout(timeout);
        handlers.onOpen?.();
      };

      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.type === 'offer') {
          handlers.onOffer?.(data.offer);
        } else if (data.type === 'answer') {
          handlers.onAnswer?.(data.answer);
        } else if (data.type === 'candidate') {
          handlers.onCandidate?.(data.candidate);
        } else {
          handlers.onMessage?.(data);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        handlers.onError?.(error);
      };

      ws.onclose = (event) => {
        console.warn('WebSocket connection closed. Reconnecting...');
        handlers.onClose?.(event);
        clearTimeout(timeout);
        timeout = setTimeout(connect, reconnectInterval);
      };
    };

    connect();

    return () => {
      clearTimeout(timeout);
      if (ws) {
        ws.onclose = null; // Prevent triggering the reconnect logic during cleanup
        ws.close();
      }
    };
  }, [url, reconnectInterval, handlers]);

  return socket;
};

export default function WebSocketComponent() {
  const socket = useWebSocketWithReconnect('ws://localhost:8080', 5000, {
    onOffer: handleOffer,
    onAnswer: handleAnswer,
    onCandidate: handleCandidate,
    onOpen: () => console.log('Custom handler: connection opened'),
    onClose: () => console.log('Custom handler: connection closed'),
    onError: (error) => console.error('Custom handler: error occurred', error),
  });

  return <div>WebSocket connection status: {socket ? 'Connected' : 'Disconnected'}</div>;
}

function handleOffer(offer) {
  console.log('Handling offer:', offer);
  // Add offer handling logic here
}

function handleAnswer(answer) {
  console.log('Handling answer:', answer);
  // Add answer handling logic here
}

function handleCandidate(candidate) {
  console.log('Handling candidate:', candidate);
  // Add candidate handling logic here
}
