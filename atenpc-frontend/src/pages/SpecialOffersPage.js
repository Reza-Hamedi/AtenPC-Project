// src/pages/SpecialOffersPage.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import './ProductListPage.css'; // استفاده مجدد از استایل

const SpecialOffersPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({ count: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    const fetchOffers = async (page) => {
      setLoading(true);
      try {
        const response = await api.get(`/products/special-offers/?page=${page}`);
        if (response.data && response.data.results) {
          setProducts(response.data.results);
          setPaginationData({ count: response.data.count });
        }
      } catch (error) {
        console.error("Error fetching special offers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="main-content">
      <div className="product-list-container">
        <h2>پیشنهادات شگفت‌انگیز</h2>
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
      </div>
    </main>
  );
};

export default SpecialOffersPage;