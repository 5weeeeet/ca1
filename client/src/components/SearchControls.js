import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';

const SearchControls = ({ setIsSearching }) => {
  const [isActive, setIsActive] = useState(false);

  // Инициализация Pusher
  useEffect(() => {
    const pusher = new Pusher('d1f91a7cd0838753276e', { // Замените на ваш ключ
      cluster: 'eu', // Замените на ваш кластер
      forceTLS: true,
    });

    const channel = pusher.subscribe('video-chat-channel');

    // Слушаем событие "found" для уведомления о найденном собеседнике
    channel.bind('found', (data) => {
      console.log('Собеседник найден:', data);
      setIsSearching(false); // Останавливаем поиск
      setIsActive(false);
    });

    return () => {
      pusher.unsubscribe('video-chat-channel');
      pusher.disconnect();
    };
  }, [setIsSearching]);

  const handleSearch = () => {
    const newState = !isActive;
    setIsActive(newState);
    setIsSearching(newState);

    // Отправляем событие "search" через Pusher
    const pusher = new Pusher('d1f91a7cd0838753276e', {
      cluster: 'eu',
      forceTLS: true,
    });
    const channel = pusher.subscribe('video-chat-channel');
    channel.trigger('client-search', { isSearching: newState });
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