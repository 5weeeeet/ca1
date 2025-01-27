import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';

const SearchControls = ({ setIsSearching }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Неактивно'); // Состояние для отображения статуса
  const pusherRef = useRef(null);

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
      setStatus('Собеседник найден');
    });

    // Обработка ошибок подписки
    channel.bind('pusher:subscription_error', (error) => {
      console.error('Ошибка подписки на канал:', error);
      setStatus('Ошибка подключения');
    });

    // Очистка при размонтировании компонента
    return () => {
      if (pusherRef.current) {
        pusherRef.current.unsubscribe('video-chat-channel');
        pusherRef.current.disconnect();
      }
    };
  }, [setIsSearching]);

  const handleSearch = () => {
    const newState = !isActive;
    setIsActive(newState);
    setIsSearching(newState);
    setStatus(newState ? 'Поиск активен' : 'Поиск прекращен');

    // Проверка, что Pusher инициализирован
    if (!pusherRef.current) {
      console.error('Pusher не инициализирован');
      setStatus('Ошибка: Pusher не инициализирован');
      return;
    }

    // Отправка события "client-search"
    const channel = pusherRef.current.subscribe('video-chat-channel');
    if (channel) {
      channel.trigger('client-search', { isSearching: newState });
      console.log('Отправлено событие client-search:', { isSearching: newState });
    } else {
      console.error('Канал не подключен');
      setStatus('Ошибка: Канал не подключен');
    }
  };

  const handleNextPartner = () => {
    console.log('Запрос следующего собеседника');
    setStatus('Поиск следующего собеседника');
    // Логика для поиска следующего собеседника
  };

  return (
    <div className="search-controls">
      <button onClick={handleSearch}>
        {isActive ? 'Прекратить поиск' : 'Начать поиск'}
      </button>
      <button onClick={handleNextPartner}>Далее</button>
      <p>Статус: {status}</p>
    </div>
  );
};

export default SearchControls;