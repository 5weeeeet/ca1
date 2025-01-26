import React, { useState } from 'react';

const Filters = ({ setFilters }) => {
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState('');

  const applyFilters = () => {
    const filters = {};
    if (gender) filters.gender = gender;
    if (country) filters.country = country;
    if (age) filters.age = age;
    setFilters(filters);
  };

  return (
    <div className="filters">
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Любой пол</option>
        <option value="male">Мужской</option>
        <option value="female">Женский</option>
      </select>
      <input
        type="text"
        placeholder="Страна"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <input
        type="number"
        placeholder="Возраст"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={applyFilters}>Применить фильтры</button>
    </div>
  );
};

export default Filters;