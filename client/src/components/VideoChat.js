import React, { useEffect, useRef, useCallback, useState } from 'react';
import { createPeerConnection } from '../utils/webrtc';
import Pusher from 'pusher-js';

const VideoChat = React.memo(() => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const pusherRef = useRef(null);

  // Обработка offer
  const handleOffer = useCallback(async (offer) => {
    const pc = createPeerConnection();
    peerConnectionRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const channel = pusherRef.current.subscribe('private-video-chat-channel');
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

    const channel = pusherRef.current.subscribe('private-video-chat-channel');
    channel.trigger('client-answer', { answer });
  }, []);

  // Инициализация Pusher и подписка на события
  useEffect(() => {
    pusherRef.current = new Pusher('d1f91a7cd0838753276e', {
      cluster: 'eu',
      forceTLS: true,
      authEndpoint: '/.netlify/functions/pusher-auth', // Укажите ваш endpoint для авторизации
    });

    const channel = pusherRef.current.subscribe('private-video-chat-channel');

    // Логирование подписки на канал
    channel.bind('pusher:subscription_succeeded', () => {
      console.log('Успешно подключен к каналу private-video-chat-channel');
    });

    channel.bind('pusher:subscription_error', (error) => {
      console.error('Ошибка подключения к каналу:', error);
    });

    // Обработка события "client-search"
    channel.bind('client-search', (data) => {
      console.log('Получено событие client-search:', data);
      if (data.isSearching) {
        setIsSearching(true);
        channel.trigger('client-search-response', { isSearching: true });
        console.log('Отправлено событие client-search-response');
      }
    });

    // Обработка события "client-search-response"
    channel.bind('client-search-response', (data) => {
      console.log('Получено событие client-search-response:', data);
      if (data.isSearching && isSearching) {
        console.log('Найден собеседник');
        setIsSearching(false);

        // Создаем PeerConnection и отправляем offer
        const pc = createPeerConnection();
        peerConnectionRef.current = pc;

        pc.onicecandidate = (event) => {
          if (event.candidate) {
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

        pc.createOffer()
          .then(offer => {
            pc.setLocalDescription(offer);
            channel.trigger('client-offer', { offer });
          })
          .catch(error => {
            console.error('Ошибка при создании offer:', error);
          });
      }
    });

    // Обработка события "client-offer"
    channel.bind('client-offer', async (data) => {
      console.log('Получен offer:', data.offer);
      try {
        await handleOffer(data.offer);
      } catch (error) {
        console.error('Ошибка при обработке offer:', error);
      }
    });

    // Обработка события "client-answer"
    channel.bind('client-answer', async (data) => {
      console.log('Получен answer:', data.answer);
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          console.log('Установлен удаленный answer');
        } catch (error) {
          console.error('Ошибка при установке answer:', error);
        }
      }
    });

    // Обработка события "client-candidate"
    channel.bind('client-candidate', async (data) => {
      console.log('Получен candidate:', data.candidate);
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          console.log('Добавлен ICE candidate');
        } catch (error) {
          console.error('Ошибка при добавлении ICE candidate:', error);
        }
      }
    });

    // Очистка при размонтировании компонента
    return () => {
      pusherRef.current.unsubscribe('private-video-chat-channel');
      pusherRef.current.disconnect();
    };
  }, [isSearching, handleOffer]);

  // Захват медиапотока
  useEffect(() => {
    let stream = null;

    navigator.mediaDevices.getUserMedia({ 
      video: { width: 640, height: 480 }, 
      audio: true 
    })
      .then(mediaStream => {
        stream = mediaStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          console.log('Медиапоток захвачен');
        }
      })
      .catch(error => {
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