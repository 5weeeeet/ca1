import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';

const SearchControls = ({ setIsSearching }) => {
  const [isActive, setIsActive] = useState(false);
  const pusherRef = useRef(null); // Используем useRef для хранения экземпляра Pusher

  useEffect(() => {
    // Инициализация Pusher
    pusherRef.current = new Pusher('d1f91a7cd0838753276e', {
      cluster: 'eu',
      forceTLS: true,
    });

    const channel = pusherRef.current.subscribe('video-chat-channel');

    // Обработка события "found"
    channel.bind('found', (data) => {
      console.log('Собеседник найден:', data);
      setIsSearching(false);
      setIsActive(false);
    });

    // Очистка при размонтировании компонента
    return () => {
      pusherRef.current.unsubscribe('video-chat-channel');
      pusherRef.current.disconnect();
    };
  }, [setIsSearching]);

  const handleSearch = () => {
    const newState = !isActive; // Определяем новое состояние
    setIsActive(newState);
    setIsSearching(newState);

    // Отправляем событие "client-search"
    const channel = pusherRef.current.subscribe('video-chat-channel');
    channel.trigger('client-search', { isSearching: newState });
    console.log('Отправлено событие client-search:', { isSearching: newState });
  };

  return (
    <div className="search-controls">
      <button onClick={handleSearch}>
        {isActive ? 'Прекратить поиск' : 'Начать поиск'}
      </button>
      <button onClick={() => console.log('Next partner')}>Далее</button>
    </div>
  );
};

export default SearchControls;