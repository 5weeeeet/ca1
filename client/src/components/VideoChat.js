import React, { useEffect, useRef, useState } from 'react';
import { createPeerConnection, createOffer, createAnswer } from '../utils/webrtc';

const VideoChat = ({ filters, isSearching }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Подключаемся к WebSocket серверу
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

    // Получаем доступ к камере и микрофону
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
      })
      .catch(error => console.error('Error accessing media devices:', error));

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const stopSearching = () => {
      if (socket) {
        socket.send(JSON.stringify({ type: 'stop' }));
      }
      if (peerConnection) {
        peerConnection.close();
        setPeerConnection(null);
      }
    };

    if (isSearching) {
      startSearching();
    } else {
      stopSearching();
    }
  }, [isSearching, socket, peerConnection]); // Добавлены зависимости

  const startSearching = () => {
    if (socket) {
      socket.send(JSON.stringify({ type: 'search', filters }));
    }
  };

  const handleOffer = async (offer) => {
    const pc = createPeerConnection();
    setPeerConnection(pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
      }
    };

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    const stream = localVideoRef.current.srcObject;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.send(JSON.stringify({ type: 'answer', answer }));
  };

  const handleAnswer = async (answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleCandidate = async (candidate) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  return (
    <div className="video-chat">
      <video ref={localVideoRef} autoPlay muted></video>
      <video ref={remoteVideoRef} autoPlay></video>
    </div>
  );
};

export default VideoChat;