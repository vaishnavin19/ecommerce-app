import React, { useState, useEffect } from 'react';
import '../SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); 

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by SKU or name..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;