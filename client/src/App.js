import React, { useState } from 'react';
import VideoChat from './components/VideoChat';
import SearchControls from './components/SearchControls';
import Filters from './components/Filters';
import Chat from './components/Chat';

function App() {
  const [filters, setFilters] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="App">
      <Filters setFilters={setFilters} />
      <VideoChat filters={filters} isSearching={isSearching} />
      <SearchControls setIsSearching={setIsSearching} />
      <Chat />
    </div>
  );
}

export default App;