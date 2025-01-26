import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';

const SearchControls = ({ setIsSearching }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const pusher = new Pusher('d1f91a7cd0838753276e', {
      cluster: 'eu',
      forceTLS: true,
    });

    const channel = pusher.subscribe('video-chat-channel');
    channel.trigger('client-search', { isSearching: newState });
    console.log('Отправлено событие client-search:', { isSearching: newState });
    
    channel.bind('found', (data) => {
      console.log('Собеседник найден:', data);
      setIsSearching(false);
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

    const pusher = new Pusher('d1f91a7cd0838753276e', {
      cluster: 'eu',
      forceTLS: true,
    });
    const channel = pusher.subscribe('video-chat-channel');
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