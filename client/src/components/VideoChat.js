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

    const stream = localVideoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.send(JSON.stringify({ type: 'answer', answer }));
  }, [socket]);

  // Остальные обработчики остаются без изменений
  // ... 

  // Получение доступа к камере и микрофону (ИСПРАВЛЕННЫЙ ЭФФЕКТ)
  useEffect(() => {
    let stream = null; // Сохраняем поток в переменную

    navigator.mediaDevices.getUserMedia({ 
      video: { width: 640, height: 480 }, 
      audio: true 
    })
    .then(mediaStream => {
      stream = mediaStream; // Сохраняем в переменную эффекта
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    })
    .catch(error => console.error('Error accessing media devices:', error));

    return () => {
      // Используем сохраненную переменную вместо localVideoRef.current
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="video-chat">
      <video ref={localVideoRef} autoPlay muted></video>
      <video ref={remoteVideoRef} autoPlay></video>
    </div>
  );
});

export default VideoChat;