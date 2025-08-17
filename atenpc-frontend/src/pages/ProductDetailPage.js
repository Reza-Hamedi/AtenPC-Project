// src/pages/ProductDetailPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Modal, Button } from 'antd';
import StickyAddToCart from '../components/StickyAddToCart';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageGallery from '../components/ImageGallery';
import ProductInfo from '../components/ProductInfo';
import BuyBox from '../components/BuyBox';
import RelatedProducts from '../components/RelatedProducts';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSpecsModalVisible, setIsSpecsModalVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const buyBoxRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}/`);
        setProduct(response.data);
        
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        const updatedViewed = recentlyViewed.filter(productId => productId !== parseInt(id));
        updatedViewed.unshift(parseInt(id));
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed.slice(0, 10)));
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!buyBoxRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );

    const currentBuyBox = buyBoxRef.current;
    observer.observe(currentBuyBox);

    return () => {
      if (currentBuyBox) {
        observer.unobserve(currentBuyBox);
      }
    };
  }, [product]);

  if (loading) return <LoadingSpinner />;
  if (!product) return <p>محصولی یافت نشد.</p>;

  return (
    <main className="main-content">
      <div className="product-detail-container">
        <div className="product-gallery-column">
          <ImageGallery images={product.images} mainImage={product.image} />
        </div>
        <div className="product-info-column">
          <ProductInfo product={product} />
        </div>
        <div className="product-buy-column" ref={buyBoxRef}>
          <BuyBox product={product} />
        </div>
        <div className="product-extra-details">
          <div className="specs-section">
            <h3>مشخصات فنی</h3>
            <div className={`collapsible-content ${isSpecsExpanded ? 'expanded' : ''}`}>
              <table className="specs-table">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr key={index}><th>{spec.name}</th><td>{spec.value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="expand-btn-desktop" onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}>
              {isSpecsExpanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
            </button>
            <Button type="primary" className="expand-btn-mobile" onClick={() => setIsSpecsModalVisible(true)}>
              مشاهده مشخصات فنی
            </Button>
          </div>
          
          {product.review && (
            <div className="review-section">
              <h3>نقد و بررسی</h3>
              <div className={`collapsible-content ${isReviewExpanded ? 'expanded' : ''}`} dangerouslySetInnerHTML={{ __html: product.review }} />
              <button className="expand-btn-desktop" onClick={() => setIsReviewExpanded(!isReviewExpanded)}>
                {isReviewExpanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
              </button>
              <Button type="primary" className="expand-btn-mobile" onClick={() => setIsReviewModalVisible(true)}>
                مشاهده نقد و بررسی
              </Button>
            </div>
          )}
          <RelatedProducts productId={id} categorySlug={product.category.slug} />
        </div>
      </div>
      
      <Modal title="مشخصات فنی" open={isSpecsModalVisible} onCancel={() => setIsSpecsModalVisible(false)} footer={null}>
        <table className="specs-table">
          <tbody>
            {product.specifications.map((spec, index) => (
              <tr key={index}><th>{spec.name}</th><td>{spec.value}</td></tr>
            ))}
          </tbody>
        </table>
      </Modal>
      <Modal title="نقد و بررسی" open={isReviewModalVisible} onCancel={() => setIsReviewModalVisible(false)} footer={null}>
        <div dangerouslySetInnerHTML={{ __html: product.review }} />
      </Modal>
      
      <StickyAddToCart product={product} isVisible={showStickyBar} />
    </main>
  );
};

export default ProductDetailPage;