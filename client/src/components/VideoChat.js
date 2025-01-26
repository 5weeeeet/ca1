import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPeerConnection } from '../utils/webrtc';

const VideoChat = ({ filters, isSearching }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [socket, setSocket] = useState(null);

  const handleOffer = useCallback(async (offer) => {
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
    stream.getTracks().forEach((track) => {
      const senders = pc.getSenders();
      if (!senders.find((sender) => sender.track === track)) {
        pc.addTrack(track, stream);
      }
    });

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.send(JSON.stringify({ type: 'answer', answer }));
  }, [socket]);

  const handleAnswer = useCallback(async (answer) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }, [peerConnection]);

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

  // useEffect(() => {
  //   // Установка WebSocket соединения
  //   const ws = new WebSocket('ws://localhost:8080');
  //   setSocket(ws);

  //   ws.onmessage = (message) => {
  //     const data = JSON.parse(message.data);
  //     if (data.type === 'offer') {
  //       handleOffer(data.offer);
  //     } else if (data.type === 'answer') {
  //       handleAnswer(data.answer);
  //     } else if (data.type === 'candidate') {
  //       handleCandidate(data.candidate);
  //     }
  //   };

  //   let isMounted = true;
  //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  //     .then((stream) => {
  //       if (isMounted) {
  //         localVideoRef.current.srcObject = stream;
  //       }
  //     })
  //     .catch((error) => console.error('Error accessing media devices:', error));

  //   return () => {
  //     isMounted = false;
  //     ws.close();
  //   };
  // }, [handleOffer, handleAnswer, handleCandidate]);
  
  useEffect(() => {
    // Создаём WebSocket соединение один раз
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
  
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    // Возвращаем функцию очистки для закрытия соединения
    return () => {
      ws.close();
    };
    // Зависимости убраны, чтобы соединение создавалось один раз
  }, [handleOffer, handleAnswer, handleCandidate]); // Пустой массив зависимостей означает, что эффект выполняется только один раз.
  useEffect(() => {
    if (isSearching) {
      startSearching();
    } else {
      if (socket) {
        socket.send(JSON.stringify({ type: 'stop' }));
      }
      if (peerConnection) {
        peerConnection.ontrack = null;
        peerConnection.onicecandidate = null;
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
};

export default VideoChat;
