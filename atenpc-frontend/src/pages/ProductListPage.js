// src/pages/ProductListPage.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import HeroBanner from '../components/HeroBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import FeaturedBrands from '../components/FeaturedBrands';
import SpecialOffers from '../components/SpecialOffers';
import PromoBanners from '../components/PromoBanners';
import RecentlyViewed from '../components/RecentlyViewed';
import QuickViewModal from '../components/QuickViewModal';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({ count: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [homepageData, setHomepageData] = useState(null); // State جدید برای داده‌های تجمیع شده
  const PAGE_SIZE = 12;

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewVisible, setIsQuickViewVisible] = useState(false);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const response = await api.get('/homepage-data/');
        setHomepageData(response.data);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      }
    };

    const fetchProducts = async (page) => {
      setLoading(true);
      try {
        const response = await api.get(`/products/?page=${page}`);
        if (response.data && response.data.results) {
          setProducts(response.data.results);
          setPaginationData({ count: response.data.count });
        }
      } catch (error) {
        console.error("خطا در دریافت محصولات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleShowQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewVisible(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewVisible(false);
    setQuickViewProduct(null);
  };

  if (!homepageData) {
    return <LoadingSpinner />; // نمایش لودر تا زمان دریافت داده‌های اولیه
  }

  return (
    <>
      <HeroBanner banners={homepageData.banners} />
      <PromoBanners banners={homepageData.promo_banners} />
      <SpecialOffers offers={homepageData.special_offers} onQuickView={handleShowQuickView} />

      <main className="main-content">
        <div className="product-list-container">
          <h2 className="product-section-title">آخرین محصولات</h2>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="product-grid">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={handleShowQuickView}
                  />
                ))}
              </div>
              <Pagination
                count={paginationData.count}
                page={currentPage}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </main>

      <FeaturedBrands brands={homepageData.featured_brands} />
      <RecentlyViewed />

      <QuickViewModal
        product={quickViewProduct}
        visible={isQuickViewVisible}
        onClose={handleCloseQuickView}
      />
    </>
  );
};

export default ProductListPage;