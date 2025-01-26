import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPeerConnection } from '../utils/webrtc';

const VideoChat = React.memo(({ filters, isSearching }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [socket, setSocket] = useState(null);

  // Функция для обработки предложения (offer)
  const handleOffer = useCallback(async (offer) => {
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

    const stream = localVideoRef.current?.srcObject;
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
    }
  }, [socket, filters]);

  // Подключение к WebSocket серверу
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === 'offer') {
        handleOffer(data.offer);
      } else if (data.type === 'answer') {
        handleAnswer(data.answer);
      } else if (data.type === 'candidate') {
        handleCandidate(data.candidate);
      }
    };

    return () => {
      ws.close(); // Закрываем WebSocket при размонтировании
    };
  }, [handleOffer, handleAnswer, handleCandidate]);

  // Получение доступа к камере и микрофону
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(error => console.error('Error accessing media devices:', error));

    return () => {
      const stream = localVideoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Останавливаем видеопоток
      }
    };
  }, []);

  // Управление поиском собеседника
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
  }, [isSearching, startSearching, socket, peerConnection]);

  return (
    <div className="video-chat">
      <video ref={localVideoRef} autoPlay muted></video>
      <video ref={remoteVideoRef} autoPlay></video>
    </div>
  );
});

export default VideoChat;