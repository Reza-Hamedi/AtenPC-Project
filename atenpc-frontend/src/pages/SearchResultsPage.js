// src/pages/SearchResultsPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination'; // <-- ایمپورت
import './ProductListPage.css';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({ count: 0 });
  
  const query = searchParams.get('query');
  const category = searchParams.get('category');
  const currentPage = parseInt(searchParams.get('page') || '1');
  const PAGE_SIZE = 12;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/`, {
          params: { 
            query, 
            category: category === 'all' ? '' : category,
            page: currentPage,
          }
        });
        setProducts(response.data.results);
        setPaginationData({ count: response.data.count });
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query, category, currentPage]);

  const handlePageChange = (newPage) => {
    // Update the URL with the new page number
    setSearchParams({ query, category, page: newPage });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="main-content">
      <div className="product-list-container">
        <h2>نتایج جستجو برای: "{query}"</h2>
        {products.length > 0 ? (
          <>
            <div className="product-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination 
              count={paginationData.count}
              page={currentPage}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="no-results-container">
            <p>محصولی مطابق با جستجوی شما یافت نشد.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchResultsPage;