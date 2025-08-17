// src/components/SearchForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchForm.css';

const SearchForm = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const searchPath = `/search?query=${query}`;
      navigate(searchPath);
      if (onSearch) {
        onSearch();
      }
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="search-form-container">
      <input
        type="text"
        className="search-form-input"
        placeholder="جستجوی محصولات..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-form-button">جستجو</button>
    </form>
  );
};

export default SearchForm;