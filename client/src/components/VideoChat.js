import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPeerConnection } from '../utils/webrtc';

const VideoChat = React.memo(({ filters, isSearching }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [socket, setSocket] = useState(null);

  // Функция для обработки предложения (offer)
  const handleOffer = useCallback(async (offer) => {
    if (!socket) return;
    const pc = createPeerConnection();
    setPeerConnection(pc);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const stream = localVideoRef.current ? localVideoRef.current.srcObject : null;
    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    if (socket) {
      socket.send(JSON.stringify({ type: 'answer', answer }));
    }
  }, [socket]);

  // Функция для обработки ответа (answer)
  const handleAnswer = useCallback(async (answer) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }, [peerConnection]);

  // Функция для обработки ICE-кандидатов
  const handleCandidate = useCallback(async (candidate) => {
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }, [peerConnection]);

  // Функция для начала поиска
  const startSearching = useCallback(() => {
    if (socket) {
      socket.send(JSON.stringify({ type: 'search', filters }));
      console.log('Search started'); // Логируем начало поиска
    }
  }, [socket, filters]);

  // Подключение к WebSocket серверу
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        console.log('Received message:', data); // Логируем входящие сообщения

        if (data.type === 'offer') {
          handleOffer(data.offer);
        } else if (data.type === 'answer') {
          handleAnswer(data.answer);
        } else if (data.type === 'candidate') {
          handleCandidate(data.candidate);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [handleOffer, handleAnswer, handleCandidate]);

  // Управление поиском
  useEffect(() => {
    if (isSearching) {
      startSearching();
    } else {
      if (socket) {
        socket.send(JSON.stringify({ type: 'stop' }));
      }
      if (peerConnection) {
        peerConnection.close();
        setPeerConnection(null);
      }
    }
  }, [isSearching, startSearching, socket, peerConnection, setPeerConnection]);

  return (
    <div className="video-chat">
      <video ref={localVideoRef} autoPlay muted></video>
      <video ref={remoteVideoRef} autoPlay></video>
    </div>
  );
});

export default VideoChat;