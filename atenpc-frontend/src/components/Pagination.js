// src/components/Pagination.js
import React from 'react';
import './Pagination.css';

const Pagination = ({ count, page, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  const handlePageClick = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="pagination-container">
      <button 
        onClick={() => handlePageClick(page - 1)} 
        disabled={page === 1}
        className="pagination-button"
      >
        قبلی
      </button>
      <span className="pagination-info">
        صفحه {page} از {totalPages}
      </span>
      <button 
        onClick={() => handlePageClick(page + 1)} 
        disabled={page === totalPages}
        className="pagination-button"
      >
        بعدی
      </button>
    </div>
  );
};

export default Pagination;