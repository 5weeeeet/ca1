import React, { useState } from 'react';

const SearchControls = ({ setIsSearching }) => {
  const [isActive, setIsActive] = useState(false);

  const handleSearch = async () => {
    const newState = !isActive;
    setIsActive(newState);
    setIsSearching(newState);

    // Отправляем запрос на сервер для поиска собеседника
    try {
      const response = await fetch('http://localhost:3000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isSearching: newState }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке запроса');
      }

      const data = await response.json();
      console.log('Ответ от сервера:', data);
    } catch (error) {
      console.error('Ошибка:', error);
      setIsActive(!newState); // Откат состояния в случае ошибки
      setIsSearching(!newState);
    }
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