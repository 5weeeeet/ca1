import React, { useEffect, useRef, useCallback, useState } from 'react';
import { createPeerConnection } from '../utils/webrtc';
import Pusher from 'pusher-js';

const VideoChat = React.memo(() => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleOffer = useCallback(async (offer) => {
    const pc = createPeerConnection();
    peerConnectionRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const pusher = new Pusher('d1f91a7cd0838753276e', {
          cluster: 'eu',
          forceTLS: true,
        });
        const channel = pusher.subscribe('video-chat-channel');
        channel.trigger('client-candidate', { candidate: event.candidate });
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

    const pusher = new Pusher('d1f91a7cd0838753276e', {
      cluster: 'eu',
      forceTLS: true,
    });
    const channel = pusher.subscribe('video-chat-channel');
    channel.trigger('client-answer', { answer });
  }, []);

  useEffect(() => {
    const pusher = new Pusher('d1f91a7cd0838753276e', {
      cluster: 'eu',
      forceTLS: true,
    });

    const channel = pusher.subscribe('video-chat-channel');

    channel.bind('client-search', (data) => {
      console.log('Получено событие client-search:', data);
      if (data.isSearching) {
        setIsSearching(true);
        channel.trigger('client-search-response', { isSearching: true });
      }
    });

    channel.bind('client-search-response', (data) => {
      if (data.isSearching && isSearching) {
        console.log('Найден собеседник');
        setIsSearching(false);
        // Здесь можно начать обмен offer/answer
      }
    });

    channel.bind('client-offer', async (data) => {
      console.log('Получен offer:', data.offer);
      await handleOffer(data.offer);
    });

    channel.bind('client-answer', async (data) => {
      console.log('Получен answer:', data.answer);
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    channel.bind('client-candidate', async (data) => {
      console.log('Получен candidate:', data.candidate);
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    return () => {
      pusher.unsubscribe('video-chat-channel');
      pusher.disconnect();
    };
  }, [handleOffer, isSearching]);

  useEffect(() => {
    let stream = null;

    navigator.mediaDevices.getUserMedia({ 
      video: { width: 640, height: 480 }, 
      audio: true 
    }).then(mediaStream => {
      stream = mediaStream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log('Медиапоток захвачен');
      }
    }).catch(error => {
      console.error('Ошибка захвата медиапотока:', error);
    });

    return () => {
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