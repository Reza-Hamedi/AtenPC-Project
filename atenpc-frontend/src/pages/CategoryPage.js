// src/pages/CategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import './ProductListPage.css';

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({ count: 0 });
  
  const currentPage = parseInt(searchParams.get('page') || '1');
  const PAGE_SIZE = 12;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/`, {
          params: { 
            category_slug: slug,
            page: currentPage,
          }
        });
        setProducts(response.data.results);
        setPaginationData({ count: response.data.count });
        // For a better title, we could get the category name from another API call or the product data
        setCategoryName(slug);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug, currentPage]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="main-content">
      <div className="product-list-container">
        <h2>محصولات دسته‌بندی: {categoryName}</h2>
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
            <p>محصولی در این دسته‌بندی یافت نشد.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryPage;