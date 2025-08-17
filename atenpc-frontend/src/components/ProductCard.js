// src/components/ProductCard.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../utils/formatters';
import { EyeOutlined } from '@ant-design/icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './ProductCard.css';

const ProductCard = ({ product, onQuickView }) => {
  const correctImageUrl = product.image ? product.image.replace('12.7.0.0.1', '127.0.0.1') : '';
  const { addToCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleAddToCart = () => {
    const success = addToCart(product);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    }
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    onQuickView(product);
  };

  const shakeVariants = {
    shake: { x: [0, -8, 8, -8, 8, 0], transition: { duration: 0.4 } },
    initial: { x: 0 }
  };

  return (
    <div className="product-card">
      {product.discount_percentage > 0 && (
        <div className="discount-badge-card">{formatPrice(product.discount_percentage)}%</div>
      )}
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <LazyLoadImage
            alt={product.name}
            src={correctImageUrl}
            effect="blur"
            className="product-image"
          />
          <button className="quick-view-btn" onClick={handleQuickViewClick}>
            <EyeOutlined />
            <span>مشاهده سریع</span>
          </button>
        </div>
        <div className="product-info">
          <p className="product-name">{product.name}</p>
        </div>
      </Link>
      <div className="product-price-section">
        {product.discount_percentage > 0 && (
          <span className="original-price-card">{formatPrice(product.price)}</span>
        )}
        <div className="price-wrapper-card">
          <span className="final-price-card">{formatPrice(product.final_price)}</span>
          <span className="currency-card">تومان</span>
        </div>
      </div>
      <div className="add-to-cart-wrapper">
        <AnimatePresence>
          {!isAdded ? (
            <motion.button
              key="add"
              variants={shakeVariants}
              animate={isError ? "shake" : "initial"}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleAddToCart}
              className="add-to-cart-button"
            >
              افزودن به سبد خرید
            </motion.button>
          ) : (
            <motion.div
              key="added"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="added-to-cart-feedback"
            >
              <span>✓</span> اضافه شد
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductCard;