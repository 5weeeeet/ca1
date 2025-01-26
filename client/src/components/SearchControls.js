import React, { useState } from 'react';

const SearchControls = ({ setIsSearching }) => {
  const [isActive, setIsActive] = useState(false);

  const handleSearch = () => {
    if (typeof setIsSearching === 'function') {
      setIsActive(prev => {
        const newState = !prev;
        setIsSearching(newState); // Синхронизируем состояния
        return newState;
      });
    } else {
      console.error('setIsSearching is not a function');
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