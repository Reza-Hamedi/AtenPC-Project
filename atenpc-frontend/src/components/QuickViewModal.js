// src/components/QuickViewModal.js
import React from 'react';
import { Modal } from 'antd';
import ImageGallery from './ImageGallery';
import BuyBox from './BuyBox';
import './QuickViewModal.css';

const QuickViewModal = ({ product, visible, onClose }) => {
  if (!product) return null;

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={800} centered zIndex={1050}>
      <div className="quick-view-layout">
        <div className="quick-view-gallery">
          <ImageGallery images={product.images} mainImage={product.image} />
        </div>
        <div className="quick-view-details">
          <h2>{product.name}</h2>
          {product.description && (<p className="quick-view-short-desc">{product.description}</p>)}
          <BuyBox product={product} />
        </div>
      </div>
    </Modal>
  );
};
export default QuickViewModal;