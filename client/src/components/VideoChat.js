import React, { useEffect, useRef, useState } from 'react';

const VideoChat = ({ filters, isSearching }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    // Получаем доступ к камере и микрофону
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        setLocalStream(stream);
      })
      .catch(error => console.error('Error accessing media devices:', error));
  }, []);

  useEffect(() => {
    if (isSearching) {
      startSearching();
    } else {
      stopSearching();
    }
  }, [isSearching]);

  const startSearching = () => {
    // Здесь будет логика поиска собеседника через WebSocket или API
    console.log('Searching for a partner...');
  };

  const stopSearching = () => {
    // Остановка поиска и закрытие соединения
    console.log('Stopped searching.');
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
  };

  return (
    <div className="video-chat">
      <video ref={localVideoRef} autoPlay muted></video>
      <video ref={remoteVideoRef} autoPlay></video>
    </div>
  );
};

export default VideoChat;