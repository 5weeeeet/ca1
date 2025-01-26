import React, { useState } from 'react';

const SearchControls = ({ setIsSearching }) => {
  const [isActive, setIsActive] = useState(false);

  const handleSearch = () => {
    setIsActive(prev => {
      const newState = !prev;
      setIsSearching(newState); // Синхронизируем состояния
      return newState;
    });
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