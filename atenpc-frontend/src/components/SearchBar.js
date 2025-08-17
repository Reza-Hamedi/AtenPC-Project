// src/components/SearchBar.js
import React from 'react';
import SearchForm from './SearchForm';
import './SearchBar.css';

const SearchBar = () => {
  return (
    <div className="search-bar">
      {/* و فرم اصلی جستجو را در خود نمایش می‌دهد */}
      <SearchForm />
    </div>
  );
};

export default SearchBar;