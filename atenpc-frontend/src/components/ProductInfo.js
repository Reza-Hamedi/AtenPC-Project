// src/components/ProductInfo.js
import React from 'react';
import './ProductInfo.css';

const ProductInfo = ({ product }) => {
  const keySpecs = product.specifications.slice(0, 6);

  return (
    <div className="product-info-container">
      <h1 className="product-title">{product.name}</h1>
      <div className="at-a-glance">
        <h3>در یک نگاه</h3>
        <div className="key-specs-grid">
          {keySpecs.map((spec, index) => (
            <div key={index} className="spec-box">
              <strong>{spec.name}:</strong> {spec.value}
            </div>
          ))}
        </div>
        {/* We will add the link to all specs later */}
      </div>
    </div>
  );
};

export default ProductInfo;