// src/components/MiniProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './MiniProductCard.css';
import { formatPrice } from '../utils/formatters';

const MiniProductCard = ({ product }) => {
  const correctImageUrl = product.image ? product.image.replace('12.7.0.0.1', '127.0.0.1') : '';

  return (
    <Link to={`/product/${product.id}`} className="mini-product-card">
      <div className="mini-product-image-container">
        <img src={correctImageUrl} alt={product.name} className="mini-product-image" />
      </div>
      <div className="mini-product-info">
        <p className="mini-product-name">{product.name}</p>
        <div className="mini-price-wrapper">
          <span className="mini-final-price">{formatPrice(product.final_price)}</span>
          <span className="mini-currency">تومان</span>
        </div>
      </div>
    </Link>
  );
};

export default MiniProductCard;