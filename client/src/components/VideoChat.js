import React, { useEffect, useRef, useCallback } from 'react';
import { createPeerConnection } from '../utils/webrtc';

const VideoChat = React.memo(() => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null); // Заменяем useState на useRef
  const socketRef = useRef(null); // Храним сокет в ref вместо useState

  // Функция для обработки предложения (offer)
  const handleOffer = useCallback(async (offer) => {
    const pc = createPeerConnection();
    peerConnectionRef.current = pc; // Сохраняем соединение в ref

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
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
    
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: 'answer', answer }));
    }
  }, []);

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
    socketRef.current = ws; // Сохраняем сокет в ref

    const handleMessage = async (message) => {
      try {
        const data = JSON.parse(message.data);
        if (data.type === 'offer') {
          await handleOffer(data.offer);
        }
        // Добавьте обработку answer и candidate при необходимости
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      
      // Очистка peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [handleOffer]);

  // Получение медиапотока (остается без изменений)
  useEffect(() => {
    let stream = null;

    navigator.mediaDevices.getUserMedia({ 
      video: { width: 640, height: 480 }, 
      audio: true 
    }).then(mediaStream => {
      stream = mediaStream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
  }, [isSearching, startSearching, socket, peerConnection]);

  return (
    <div className="video-chat">
      <video ref={localVideoRef} autoPlay muted></video>
      <video ref={remoteVideoRef} autoPlay></video>
    </div>
  );
});

export default VideoChat;